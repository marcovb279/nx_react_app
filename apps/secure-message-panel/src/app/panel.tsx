import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
import {
  Box,
  Grid,
  TextField,
  Button,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import * as _ from 'lodash';
import axios from 'axios';
import * as secUtils from '@react-app-workspace/security-utils';
import { encryptMessage } from '@react-app-workspace/security-utils';

const MyPublicKeyURL =
  'https://security-n-privacy.s3.eu-west-3.amazonaws.com/0x530EDF90_public.asc';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'green',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
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
  genPrivateKey: string;
  genPublicKey: string;
  myPublicKey: string;
  encryptedText?: string;
  decryptedText?: string;
  button: boolean;
}

class Panel extends React.Component<PanelProperties, PanelState> {
  override state: PanelState = {
    password: '',
    genPrivateKey: '',
    genPublicKey: '',
    myPublicKey: '',
    encryptedText: '',
    decryptedText: '',
    button: true,
  };

  override componentDidMount = () => {
    axios
      .request({
        url: MyPublicKeyURL,
        method: 'GET',
      })
      .then((response) => {
        this.setState({ myPublicKey: response.data });
      });
  };

  handleClick = (event: React.MouseEvent<Button>) => {
    const password = secUtils.generatePassword(10);
    this.setState({ password: password, button: false });
    secUtils
      .generateKeyPair({
        name: 'Proton Team',
        email: 'careers@protonmail.recruitee.com',
        password: password,
      })
      .then((generatedKey) =>
        this.setState({
          genPrivateKey: generatedKey.privateKey,
          genPublicKey: generatedKey.publicKey,
        })
      )
      .finally(() => {
        this.setState({ button: true });
      });
  };

  handleDecryptedMessageUpdated = _.debounce((value) => {
    if (
      this.state.myPublicKey.length > 0 &&
      this.state.genPrivateKey.length > 0 &&
      this.state.password.length > 0
    ) {
      secUtils
        .encryptMessage(
          value,
          this.state.myPublicKey,
          this.state.genPrivateKey,
          this.state.password
        )
        .then((encMessage) => {
          console.log(value);
          this.setState({ encryptedText: encMessage });
        });
    }
  }, 1000);

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
                disabled={!this.button}
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
                value={this.state.genPublicKey}
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
                value={this.state.genPrivateKey}
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
                value={this.state.encryptedText}
              />
            </Grid>
            <Grid item xs={8}>
              <CssTextField
                id="field-my-decrypted-message"
                label="Plain message"
                multiline
                rows={15}
                size="small"
                fullWidth
                onChange={(event) =>
                  this.handleDecryptedMessageUpdated(event.target.value)
                }
              />
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    );
  }
}

export default Panel;
