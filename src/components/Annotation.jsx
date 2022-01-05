import React, { useCallback } from 'react';
import { FaQuestion } from 'react-icons/fa';
import styled, { css } from 'styled-components';

import { icons } from '../config';

const Container = styled.div `
    display: flex;
    align-content: center;
    align-items: center;
    flex-direction: row;
    position: absolute;
    width: 100%;
    height: 100%;
    ${({ $edit }) => $edit && css `
        pointer-events: none;
    `}
`;
const AnnotationContainer = styled.div `
    display: flex;
    position: absolute;
    cursor: pointer;
    ${({ $x, $y }) => $x && $y && css `
        top: calc(${$y}% - 1em);
        left: calc(${$x}% - 1em);
    `}
    ${({ $color }) => $color && css `
        color: ${$color};
    `}
`;

const Text = styled.h2 `
    margin: 0;
    font-size: 1em;
    margin-left: 10px;
    color: black;
    text-transform: capitalize
`;

const Annotation = props => {
    const {
        values,
        edit,
    } = props;

    const onClick = useCallback(event => {
        event.stopPropagation();
    }, []);

    return (
        <Container $edit={edit}>
            {
                values.map(value => {
                    const iconAnnotation = icons.find(icon => icon.name === value.icon);
                    return (
                        <AnnotationContainer $x={value.x} $y={value.y} onClick={onClick} key={value.uuid} $color={value.color}>
                            { iconAnnotation ? <iconAnnotation.icon style={{ width: '2em', height: '2em' }}/> : <FaQuestion /> }
                            <Text> { value.title } </Text>
                        </AnnotationContainer>
                    );
                })
            }
        </Container>
    );
};

export default Annotation;
