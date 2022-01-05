import styled from 'styled-components';

const ColorSquare = styled.span`
    border: 2px solid #1c1c1c;
    float: left;
    width: 20px;
    height: 20px;
    margin: 5px;
    border-radius: 3px;

    &.mercenary {
        background: rgb(0 55 255 / 35%);
    }
    &.duty {
        background: rgb(255 0 0 / 35%);
    }
    &.freedom {
        background: rgb(1 211 8 / 35%);
    }
    &.military {
        background: rgb(38 98 0 / 35%);
    }
    &.brotherhood {
        background: rgb(60 20 0 / 35%);
    }
    &.csk {
        background: rgb(2 138 235 / 35%);
    }
    &.ecologist {
        background: rgb(231 117 0 / 35%);
    }
`;

export default ColorSquare;
