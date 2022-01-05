import styled from 'styled-components';

const Image = styled.img `
    height: 100vh;
`;

const Logo = styled.img `
    width: 50%;
`;

const LogoContainer = styled.div `
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    align-content: flex-end;
    height: 100%;
`;

export {
    Image,
    Logo,
    LogoContainer
}
