import React, { useState, useEffect, useMemo } from 'react';
import {
  CssBaseline, Box, Button, Card, CircularProgress, Stack, TextField, Typography,
  Snackbar, Link, Modal
} from '@mui/material';
import { AccountBalance, Sell, BarChart } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Cookies from 'js-cookie';

const Home = (props) => {
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const [mode, setMode] = useState(systemPrefersDark ? 'dark' : 'light');

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
    },
  }), [mode]);

  const [formData, setFormData] = useState({ claim: '' });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState({ open: false, message: '' });
  const [result, setResult] = useState([])
  const [show, setShow] = useState(false)

  const handleClose = () => setOpen({ open: false, message: '' });

  useEffect(() => {
    const savedMode = localStorage.getItem('app-theme-mode');
    setMode(savedMode || (systemPrefersDark ? 'dark' : 'light'));
  }, [systemPrefersDark]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verify=(event)=>{
    event.preventDefault();
    setLoading(true);
    fetch(props.host + '/verify/'+formData.claim)
      .then(response => response.json())
      .then(data => {
        if(data){
          console.log(data)
          setResult(data.result)
          setLoading(false)
          setShow(true)
        }
        else{
          setLoading(false)
          setOpen({open:true,message:'There was an error. Try again.'})
        }
      })
      .catch(error => {
        setOpen({open:true,message:'Error fetching data: '+error})
        setLoading(false)
      });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          px: 2,
        }}
      >
        <Stack
          width="100%"
          maxWidth="1100px"
          direction={{ xs: 'column-reverse', md: 'row' }}
          spacing={{ xs: 4, sm: 8 }}
        >
          {/* Left Info Section */}
          <Stack sx={{ maxWidth: 400, alignSelf: 'center' }} spacing={3}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#76ff03"
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              VeriphAI
            </Typography>
            {[
              {
                icon: <AccountBalance />,
                title: "Credible",
                desc: "Check credibility of information in the public",
              },
              {
                icon: <BarChart />,
                title: "Fact-Check",
                desc: "Find if there is any sensible truths to your news",
              },
              {
                icon: <Sell />,
                title: "Verify",
                desc: "Don't just spread only; verify and then spread.",
              },
            ].map((item, idx) => (
              <Stack key={idx} direction="row" spacing={2}>
                {item.icon}
                <div>
                  <Typography fontWeight="medium">{item.title}</Typography>
                  <Typography color="text.primary">{item.desc}</Typography>
                </div>
              </Stack>
            ))}
          </Stack>

          {/* Upload Form Card */}
          <Card
            variant="outlined"
            sx={{
              alignSelf: 'center',
              maxWidth: 700,
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
                VeriphAI
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              credible.fact-check.verify
            </Typography>
            <form onSubmit={verify}>
              <TextField
                fullWidth
                label="Claim/Story/News/Rumor"
                name="claim"
                value={formData.comment}
                onChange={handleChange}
                multiline
                maxRows={4}
              />
              <Button fullWidth type="submit" variant="contained" sx={{ mt: 2, bgcolor:"#76ff03" }}>
                Verify
              </Button>
            </form>
            <Box mt={2} textAlign="center">
              <Typography>
                Developed by Munyaradzi and Tafadzwa to uphold section 62 of our constitution.
              </Typography>
            </Box>
          </Card>
        </Stack>

        {loading && (
          <Box sx={{ zIndex: 2000 }}>
            <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%' }} />
          </Box>
        )}
        <Snackbar open={open.open} autoHideDuration={5000} onClose={handleClose} message={open.message} />

        <Modal open={show} onClose={()=>setShow(false)}>
          <Card sx={{ p: 2, maxHeight:'85vh', overflow:'auto', borderRadius: 2, maxWidth: 800, mx: "auto", mt: 5,}}>
            <Card sx={{p:2, my:1}} variant='outlined'>
              <Typography>{formData.claim}</Typography>
            </Card>
            <Card sx={{p:2, my:1}} variant='outlined' raised={true}>
              {result.map((item,index)=>(
                item.type=='heading' ?(<Typography color='primary' variant='h5'>{item.content}</Typography>):
                (<Typography variant='body2'>{item.content}</Typography>)
              ))}
            </Card>
            <Button variant='contained' color='error' onClick={()=>setShow(false)}>Close</Button>
          </Card>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default Home;