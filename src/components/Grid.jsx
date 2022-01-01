import React from 'react';
import styled, { css } from 'styled-components';

import Coordinates from './Coordinates';

const Container = styled.div `
    display: flex;
    height: 95%;
    position: absolute;
    align-items: center;
    flex-wrap: wrap;
    align-content: center;
    justify-content: flex-start;
    flex-direction: column;
`;

const ContainerCoordinates = styled.div`
    &:not(.edit) {
        pointer-events: none;
    }
`;

const Grid = props => {
    const {
        x: xVar,
        y: yVar,
        maxWidth,
        maxHeight,
        edit,
        coordinates
    } = props;

    return (
        <Container>
            {
                coordinates.map((coords, index) =>
                    <ContainerCoordinates key={`container_${index}`} className={edit ? 'edit' : ''}>
                        {
                        coords.map(xy =>
                            <Coordinates
                                faction={xy.faction}
                                maxHeight={maxHeight}
                                maxWidth={maxWidth}
                                x={xVar}
                                y={yVar}
                                coordinates={xy.coordinates}
                                key={xy.coordinates}
                                edit={edit}
                                selected={xy.selected}
                            />
                        )
                    }
                    </ContainerCoordinates>
                )
            }
        </Container>
    );
};

export default Grid;
