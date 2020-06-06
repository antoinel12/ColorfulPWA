import React, { useEffect } from "react";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { ChromePicker } from 'react-color';
import "./Popup.scss";

export default function Popup() {
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  );

  const defaultDisabled = false;
  const defaultEnabled = false;
  const defaultColor = '#FFFFFF';
  const defaultUrl = '';

  const [state, setState] = React.useState({
    disabled: defaultDisabled,
    enabled: defaultEnabled,
    color: defaultColor,
    url: defaultUrl
  });

  const handleChange = (event) => {
    if(event.target.name === 'enabled')
      setState({ ...state, [event.target.name]: event.target.checked })
    else
      setState({ ...state, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if(state.url !== ''){
      chrome.storage.sync.set({[state.url]: {
        enabled: state.enabled,
        color: state.color
      }},()=>{
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { colorChanged: true });
        });
      });
    }
  }, [state]);

  useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { getUrl: true }, (url) => {
        if(typeof url == "undefined" && chrome.runtime.lastError) {
          setState({
            disabled: true,
            enabled: defaultEnabled,
            color: defaultColor,
            url: defaultUrl
          });
          return;
        }
        
        chrome.storage.sync.get({[url]: {enabled: defaultEnabled, color: defaultColor}}, (data) => {
          if(data[url] !== undefined){
            setState({
              disabled: defaultDisabled,
              enabled: data[url].enabled,
              color: data[url].color,
              url: url
            });
          }
        });
      });
    });
  }, []);

  return (<ThemeProvider theme={theme}>
  <TextField
    id="outlined-read-only-input"
    label="URL"
    value={state.url}
    InputProps={{
      readOnly: true,
    }}
    variant="outlined"
    size="small"
    fullWidth
  />
  <FormGroup row>
    <FormControlLabel
      control={
        <Switch
          checked={state.enabled}
          onChange={handleChange}
          name="enabled"
          color="primary"
          inputProps={{
            disabled: state.disabled,
          }}
        />
      }
      label="Enabled for this site"
    /></FormGroup>
    <ChromePicker
        color={state.color}
        onChangeComplete={(color)=> setState({...state, 'color': color.hex})}
        disableAlpha={true}
      />
      <Typography align="center" variant="caption">
        <Link href="https://github.com/antoinel12/ColorfulPWA" target="_blank">ColorfulPWA</Link> v{chrome.runtime.getManifest().version}
      </Typography>
  </ThemeProvider>);
}
