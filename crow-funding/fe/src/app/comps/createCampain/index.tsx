import { ReactElement } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { CreateCampain } from 'app/solana';
import { appLoadingActions } from 'app/_commComp/loadingApp/slice';

import { names, T_InforCampaiin } from './consts';
import { CampainSchema } from './validate';

const CreateCampainComp = (): ReactElement => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<T_InforCampaiin>({
        mode: 'onBlur',
        resolver: yupResolver(CampainSchema),
    });

    const onSubmitForm = async (data: T_InforCampaiin) => {
        dispatch(appLoadingActions.loadingOpen());
        const result = await CreateCampain(data);
        dispatch(appLoadingActions.loadingClose());
        if (result) {
            navigate('/', { replace: true });
        }
    };

    const disabledBtn = !!(
        errors[names.title] ||
        errors[names.des] ||
        errors[names.imgLink] ||
        !watch()[names.title] ||
        !watch()[names.des] ||
        !watch()[names.imgLink]
    );

    return (
        <Container maxWidth="md">
            <form>
                <TextField
                    required
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    id="title"
                    type="text"
                    label="Title"
                    {...register(names.title)}
                    error={!!errors[names.title]}
                    helperText={errors[names.title]?.message}
                />
                <TextField
                    required
                    fullWidth
                    variant="outlined"
                    type="text"
                    margin="normal"
                    id="description"
                    label="Description"
                    {...register(names.des)}
                    error={!!errors[names.des]}
                    helperText={errors[names.des]?.message}
                />
                <TextField
                    required
                    fullWidth
                    variant="outlined"
                    type="text"
                    margin="normal"
                    label="Image Link"
                    {...register(names.imgLink)}
                    error={!!errors[names.imgLink]}
                    helperText={errors[names.imgLink]?.message}
                />
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    disabled={disabledBtn}
                    onClick={handleSubmit(onSubmitForm)}
                >
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default CreateCampainComp;
