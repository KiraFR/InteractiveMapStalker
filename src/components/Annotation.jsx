import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
const Container = styled.div `
    position: absolute;
    width: 100%;
    height: 100%;
    ${({ $edit }) => $edit && css `
        pointer-events: none;
    `}


`;
const AnnotationContainer = styled.div `
    position: absolute;
    cursor: pointer;
    ${({ $x, $y }) => $x && $y && css `
        top: calc(${$y}% - 0.5em);
        left: calc(${$x}% - 0.625em);
    `}


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
                values.map(value =>
                    <AnnotationContainer $x={value.x} $y={value.y} onClick={onClick} key={value.uuid}>

                    </AnnotationContainer>
                )
            }
        </Container>
    );
};

export default Annotation;
