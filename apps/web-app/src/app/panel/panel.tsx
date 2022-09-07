import { environment } from '../../environments/environment';
import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
import {
  Box,
  Grid,
  TextField,
  Button,
  CssBaseline,
  ThemeProvider,
  FormControl,
  InputLabel,
  Input,
  FilledInput,
} from '@mui/material';
import * as _ from 'lodash';
import axios from 'axios';
import * as secUtils from '@app-workspace/web-app-utils';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'white',
  },
  // '& .MuiInput-underline:after': {
  //   borderBottomColor: 'green',
  // },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'gray',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
});

interface PanelProperties {
  theme: Theme;
}

interface PanelState {
  password: string;
  generatedPrivateKey: string;
  generatedPublicKey: string;
  myPublicKey: string;
  encryptedMessage: string;
  decryptedMessage: string;
  button: boolean;
}

class Panel extends React.Component<PanelProperties, PanelState> {
  override state: PanelState = {
    password: '',
    generatedPrivateKey: '',
    generatedPublicKey: '',
    myPublicKey: '',
    encryptedMessage: '',
    decryptedMessage: '',
    button: true,
  };

  override componentDidMount = () => {
    axios
      .request({
        url: environment.MY_PUBLIC_KEY_URL,
        method: 'GET',
      })
      .then((response) => {
        this.setState({ myPublicKey: response.data });
      });
  };

  handleClick = (event: React.MouseEvent) => {
    this.setState({ button: false }, () => {
      const password = secUtils.generatePassword(10);
      this.setState({ password: password }, () => {
        secUtils
          .generateKeyPair(
            'name',
            'email@email.com',
            // name: 'Proton Team',
            // email: 'careers@protonmail.recruitee.com',
            password
          )
          .then(({ privateKey, publicKey }) =>
            this.setState(
              {
                generatedPrivateKey: privateKey,
                generatedPublicKey: publicKey,
              },
              this.updateEncryptedMessage
            )
          )
          .finally(() => {
            this.setState({ button: true });
          });
      });
    });
  };

  updateEncryptedMessage = () => {
    if (this.state.decryptedMessage.length == 0) {
      this.setState({ encryptedMessage: '' });
    } else if (
      this.state.myPublicKey.length > 0 &&
      this.state.generatedPrivateKey.length > 0 &&
      this.state.password.length > 0
    ) {
      secUtils
        .encryptMessage(
          this.state.decryptedMessage,
          this.state.myPublicKey,
          this.state.generatedPrivateKey,
          this.state.password
        )
        .then((encryptedMessage) => {
          this.setState({ encryptedMessage: encryptedMessage });
        });
    }
  };

  throttleOnChangeEncryptedMessage = _.throttle(
    () => this.updateEncryptedMessage(),
    500
  );

  onChangeDecryptedMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      { decryptedMessage: event.target.value },
      this.throttleOnChangeEncryptedMessage
    );
  };

  override render() {
    return (
      <ThemeProvider theme={this.props.theme}>
        <CssBaseline />
        <Box
          sx={{
            p: this.props.theme.spacing(2),
            border: '1px dashed grey',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <h2>Demo</h2>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={4}>
              <Button
                variant="contained"
                fullWidth
                disabled={!this.state.button}
                onClick={this.handleClick}
              >
                Generate keypair & Password
              </Button>
            </Grid>
            <Grid item xs={8}>
              <CssTextField
                id="field-your-password"
                label="Your password"
                multiline
                rows={1}
                size="small"
                fullWidth
                value={this.state.password}
              />
            </Grid>

            <Grid item xs={4}>
              <CssTextField
                id="field-your-public-key"
                label="Your Public Key"
                multiline
                rows={15}
                size="small"
                fullWidth
                value={this.state.generatedPublicKey}
              />
            </Grid>
            <Grid item xs={4}>
              <CssTextField
                id="field-your-private-key"
                label="Your Private Key"
                multiline
                rows={15}
                size="small"
                fullWidth
                value={this.state.generatedPrivateKey}
              />
            </Grid>
            <Grid item xs={4}>
              <CssTextField
                id="field-my-public-key"
                label="My Public Key"
                multiline
                rows={15}
                size="small"
                fullWidth
                value={this.state.myPublicKey}
              />
            </Grid>

            <Grid item xs={4}>
              <CssTextField
                id="field-my-encrypted-message"
                label="Encrypted Message"
                multiline
                rows={15}
                size="small"
                fullWidth
                // onChange={this.handleEncryptedMessageUpdated}
                value={this.state.encryptedMessage}
              />
            </Grid>
            <Grid item xs={8}>
              {/* <FormControl variant="standard" fullWidth>
                <InputLabel htmlFor="component-simple">
                  Decrypted message
                </InputLabel>
                <FilledInput
                  id="field-my-decrypted-message"
                  multiline
                  rows={15}
                  size="small"
                  value={this.state.decryptedMessage}
                  onChange={this.deboundedUpdateEncryptedMessage}
                />
              </FormControl> */}
              <CssTextField
                id="field-my-decrypted-message"
                label="Decrypted message"
                multiline
                rows={15}
                size="small"
                fullWidth
                value={this.state.decryptedMessage}
                onChange={this.onChangeDecryptedMessage}
              />
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    );
  }
}

export default Panel;
