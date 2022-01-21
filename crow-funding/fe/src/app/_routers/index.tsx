import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from 'app/_commComp/header';
import useSpacing from '_styles/useSpacing';

import HomePage from 'app/pages/home';
import CreateCampainPage from 'app/pages/createCampain';
import RoutersPath from './consts';

function App() {
    const spacing = useSpacing();

    return (
        <BrowserRouter>
            <Header />
            <Container maxWidth="md" className={spacing.mTop24}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Routes>
                            <Route path={RoutersPath.rHome} element={<HomePage />} />
                            <Route path={RoutersPath.rCreateCampain} element={<CreateCampainPage />} />

                            <Route
                                path="*"
                                element={
                                    <div style={{ padding: '1rem' }}>
                                        <p>There's nothing here!</p>
                                    </div>
                                }
                            />
                        </Routes>
                    </Grid>
                </Grid>
            </Container>
        </BrowserRouter>
    );
}

export default App;
