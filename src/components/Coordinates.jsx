import React, { useCallback, useContext } from 'react';
import styled, { css } from 'styled-components';
import classnames from 'classnames';

import Context from './Context';

const Container = styled.div `
    width: 97px;
    height: calc(100vh / 12);
    position: relative;
    ${({ $width, $height, $y, $x }) => $width && $height && $y && $x && css `
        width: calc(${$width}px / ${$x});
        height: calc(${$height}px / ${$y});
    `}

    ${({ $canInteract }) => $canInteract && css `
        &.selected {
            box-shadow: 0 0 10px 1px rgb(255 255 255 / 60%);
            background-color: #1e1e1e63;
        }
    `}

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

    &.sin {
        background: rgb(255 235 0 / 35%);
    }

    &:last-child {
        margin-bottom: 0;
    }

    ${({ $canInteract }) => $canInteract && css `
        background-color: #0000001f;
        border-radius: 3px;
        box-shadow: 0 0 10px 1px rgb(0 0 0 / 30%);
        cursor: pointer;

        &:hover {
            background-color: #00000045;
        }

        &.mercenary:hover {
            background-color: rgb(0 55 255 / 50%);
        }

        &.duty:hover {
            background-color: rgb(255 0 0 / 50%);
        }

        &.freedom:hover {
            background-color: rgb(1 211 8 / 50%);
        }

        &.military:hover {
            background-color: rgb(38 98 0 / 60%);
        }

        &.brotherhood:hover {
            background-color: rgb(60 20 0 / 60%);
        }

        &.csk:hover {
            background-color: rgb(2 138 235 / 60%);
        }

        &.ecologist:hover {
            background-color: rgb(231 117 0 / 60%);
        }

        &.sin:hover {
            background-color: rgb(255 235 0 / 60%);
        }

    `}
`;

const Coordinates = props => {
    const {
        faction,
        maxHeight,
        maxWidth,
        x,
        y,
        coordinates,
        children,
        edit,
        selected
    } = props;

    const {
        openList,
    } = useContext(Context);

    const onClick = useCallback(() => {
        if(edit){
            openList(coordinates, faction);
        }
    }, [ edit, openList, coordinates, faction ]);

    return (
        <Container
            className={classnames(faction, { selected })}
            onClick={onClick}
            $width={maxWidth}
            $height={maxHeight}
            $y={y}
            $x={x}
            data-coordinates={coordinates}
            key={`square_${coordinates}`}
            style={!edit ? { pointerEvents: 'none'} : {}}
            $canInteract={edit}
        >
        { children }
        </Container>
    );
}

export default Coordinates;
