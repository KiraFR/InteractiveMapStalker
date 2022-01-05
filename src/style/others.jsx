import styled from 'styled-components';
import Card from '@mui/material/Card';

const styleBox = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: '6px',
    pt: 2,
    px: 4,
    pb: 3,
};

const CardPerso = styled(Card) `
    margin: 10px 0;
`

const Text = styled.span`
    margin-left: 10px;
`;

export {
    styleBox,
    CardPerso,
    Text
};
