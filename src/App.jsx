import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import {
    Select,
    MenuItem,
    CardHeader,
    CardContent,
    FormControl,
    Modal,
    Box,
    Fade,
    TextField,
    FormGroup,
    InputLabel,
    Divider
} from '@mui/material';
import { SketchPicker } from 'react-color';
import styled, { css } from 'styled-components';
import { asyncForEach, uuid, fetchJS } from './utils';
import Map from './pictures/map.png';
import STALKER_logo from './pictures/STALKER_logo.png';
import DayZ_Logo from './pictures/DayZ_Logo.png';
import './App.css';

import Grid from './components/Grid';
import Annotation from './components/Annotation';
import Context from './components/Context';

import ButtonEdit from './style/ButtonEdit';
import ColorSquare from './style/ColorSquare';
import Container from './style/Container';
import { ListChild, ListLegend } from './style/List';
import { Image, Logo, LogoContainer } from './style/Logo';
import { styleBox, CardPerso, Text } from './style/others';
import NavBar from './style/NavBar';
import Wrapper from './style/Wrapper';

import { x, y, icons, factions } from './config';

const Label = styled.span`
    margin-left: 10px;
    text-transform: uppercase;
    font-weight: 700;
`;

const Picker = styled.div`
    ${({ $color }) => $color && css `
        background-color: ${$color};
    `}
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid #dbdbdb;
    box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%);
    cursor: pointer;

    &:hover {
      filter: brightness(90%);
    }
`;

const ColorPicker = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: 15px;
`;

const ContainerPicker = styled.div`
    position: absolute;
    z-index: 1;
    left: 60px;
`;

function App() {
    const [ width, setWidth ] = useState(null);
    const [ height, setHeight ] = useState(null);
    const [ editFaction, setEditFaction] = useState(false);
    const [ access, setAccess ] = useState(false);
    const [ passwordVisible, setPasswordVisible] = useState(false);
    const [ selected, setSelected ] = useState(null);
    const [ factionSelected, setFactionSelected ] = useState('');
    const [ coordinates, setCoordinates ] = useState([]);
    const [ annotations, setAnnotations ] = useState([]);

    const [ newAnnotation, setNewAnnotation] = useState(null);
    const [ openModal, setOpenModal ] = useState(false);
    const [ openColor, setOpenColor ] = useState(false);

    const [ password, setPassword ] = useState('');
    const [ titleAnnotation, setTitleAnnotation ] = useState('');
    const [ iconAnnotation, setIconAnnotation ] = useState('');
    const [ descAnnotation, setDescAnnotation ] = useState('');
    const [ colorAnnotation, setColorAnnotation ] = useState('#f6b73c');

    const resizeEvent = useCallback(() => {
        const picture = document.getElementById('map');
        if(picture.clientWidth > 0){
            setWidth(picture.clientWidth + 1);
            setHeight(picture.clientHeight);
        } else {
            window.setTimeout(resizeEvent, 100);
        }
    }, [ setWidth, setHeight ]);

    useEffect(() => {
        window.addEventListener('resize', resizeEvent);
        resizeEvent();
    }, [ resizeEvent ]);

    const onClickAccess = useCallback(async () => {
        if (password !== '') {
            const result = await fetchJS('/api/access',
                {
                    method: 'POST',
                    body: JSON.stringify({ password }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    cache: 'default'
                });
            if (result.access) {
                setAccess(true);
                setPasswordVisible(false);
            }
        }
        setPassword('');
    }, [ password , setPassword, setAccess, setPasswordVisible ]);

    const onChangePassword = useCallback(event => setPassword(event.target.value), [ setPassword ]);
    const onChangeTitleAnnotation = useCallback(event => setTitleAnnotation(event.target.value), [ setTitleAnnotation ]);
    const onChangeDescAnnotation = useCallback(event => setDescAnnotation(event.target.value), [ setDescAnnotation ]);
    const onChangeIconAnnotation = useCallback(event => setIconAnnotation(event.target.value), [ setIconAnnotation ]);
    const onChangeColorAnnotation = useCallback(color => { setColorAnnotation(color.hex) }, [ setColorAnnotation ]);
    const onBlurColorAnnotation = useCallback(() => setOpenColor(false), [ setOpenColor ]);
    const onClickColorAnnotation = useCallback(event => {
        setOpenColor(true);
        event.stopPropagation();
    }, [ setOpenColor ]);

    const onClickAddAnnotation = useCallback(() => {
        const annotation = {
            ...newAnnotation,
            title: titleAnnotation,
            description: descAnnotation,
            icon: iconAnnotation,
            color: colorAnnotation
        };

        setAnnotations([ ...annotations, annotation ]);
        setNewAnnotation('');
        setTitleAnnotation('');
        setDescAnnotation('');
        setIconAnnotation('');
        setColorAnnotation('#f6b73c');

        setOpenModal(false);

    }, [
        annotations, setAnnotations,
        newAnnotation, setNewAnnotation,
        titleAnnotation, setTitleAnnotation,
        descAnnotation, setDescAnnotation,
        iconAnnotation, setIconAnnotation,
        colorAnnotation,
        setOpenModal,
    ]);

    const onClick = useCallback(() => {
        if (access) setEditFaction(!editFaction);
    }, [ editFaction, setEditFaction, access ]);

    const onSelectFaction = useCallback((f) => {
        const oldCoordinates = [ ...coordinates ];

        const tmp = oldCoordinates.map(coordinateX =>
            coordinateX.map(coord => {
                if (coord.coordinates === selected) {
                    return { ...coord, faction: f }
                } else {
                    return coord;
                }
            })
        );
        setCoordinates(tmp);

        const body = {
            coordinate : selected,
            faction: f
        };

        fetchJS('/api/setZone',
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                cache: 'default'
            }
        );
    }, [ coordinates, setCoordinates, selected ]);

    const onChange = useCallback(event => {
        const f = event.target.value;
        setFactionSelected(f)
        onSelectFaction(f);
    }, [ onSelectFaction, setFactionSelected ]);

    const openList = useCallback((coords, factionCoords) => {
        if (selected !== coords) {
            const oldCoordinates = [ ...coordinates ];
            const tmp = oldCoordinates.map(coordinateX =>
                coordinateX.map(coord => {
                    if(coord.coordinates === coords && !coord.selected) {
                        return { ...coord, selected: true };
                    } else if (coord.selected) {
                        return { ...coord, selected: false };
                    } else {
                        return coord;
                    }
                })
            );
            setCoordinates(tmp);

            setSelected(coords);
            setFactionSelected(factionCoords !== '' ? factionCoords : '');
        } else {

            const oldCoordinates = [ ...coordinates ];
            const tmp = oldCoordinates.map(coordinateX =>
                coordinateX.map(coord => ({ ...coord, selected: false }))
            );
            setCoordinates(tmp);

            setSelected(null);
            setFactionSelected('');
        }
    }, [ selected, setSelected, coordinates, setCoordinates ]);

    const providerValue = useMemo(() => ({
        openList
    }), [ openList ]);

    const onhandleCloseModal = useCallback(event => {
        setNewAnnotation('');
        setTitleAnnotation('');
        setDescAnnotation('');
        setIconAnnotation('');
        setColorAnnotation('#f6b73c');
        setOpenColor(false)
        setOpenModal(false);
    }, [
        setOpenModal,
        setNewAnnotation,
        setTitleAnnotation,
        setDescAnnotation,
        setIconAnnotation,
        setColorAnnotation,
        setOpenColor
    ]);

    const onhandleClosePasswordModal = useCallback(event => {
        setPasswordVisible(false);
    }, [ setPasswordVisible ]);

    const onClickContainer = useCallback(event => {
        //if (!editFaction) {
        //    const rect = event.target.getBoundingClientRect();
        //    const uuidAnnotion = uuid();
        //    const xPos = ((event.clientX - rect.left) / width) * 100;
        //    const yPos = ((event.clientY - rect.top) / height) * 100;
        //    setNewAnnotation({ x: xPos, y: yPos, uuid : uuidAnnotion });
        //    setOpenModal(true);
        //}
    }, [ width, height, editFaction, setNewAnnotation, setOpenModal ]);

    useEffect(() => {
        const xArray = [...Array(x + 1).keys()];
        const yArray = [...Array(y + 1).keys()];
        xArray.shift();
        yArray.shift();

        const init = async () => {
            const data = await fetchJS('/api/getZone');
            let tmp = [ ];
            await asyncForEach(xArray, async xValue => {
                const charX = String.fromCharCode(64 + xValue);
                const arrayX = [];
                await asyncForEach(yArray, async (yValue, index) => {
                    const coordinatesXY = `${charX}${yValue}`;

                    const coordinatesFetched = data.find(coord => coord.coordinates === coordinatesXY);

                    arrayX.push({
                        coordinates : coordinatesXY,
                        x: charX,
                        y: yValue,
                        faction: coordinatesFetched ? coordinatesFetched.faction : '',
                        selected: false
                    })
                });
                tmp = [ ...tmp, arrayX ];
            });
            setCoordinates(tmp);
        };
        init();

        window.addEventListener('keydown', event => {
            const { shiftKey, ctrlKey, key } = event;
            if (shiftKey && ctrlKey && key === 'K') {
                if (access) {
                    setAccess(false);
                }else{
                    setPasswordVisible(true);
                }
                event.stopPropagation();
            }
        });

    }, []);

    return (
        <Context.Provider value={providerValue}>
            <Wrapper>
                <NavBar>
                    {
                        access && (
                                <ButtonEdit
                                    variant="contained"
                                    color="secondary"
                                    onClick={onClick}
                                >
                                    {editFaction ? 'Bloquer Factions' : 'Modifier Factions'}
                                </ButtonEdit>
                        )
                    }
                    {
                        access && (
                                <CardPerso sx={{ minHeight: '200px', height: '200px', maxHeight: '200px' }}>
                                    <CardHeader
                                        title="Faction"
                                        subheader="Choisis la faction qui gère cette zone"
                                    />
                                    <CardContent>
                                        <FormControl sx={{ width: '90%' }} disabled={!editFaction}>
                                            <Select
                                                className={!editFaction ? 'Mui-disabled' : ''}
                                                id="select-faction"
                                                variant="outlined"
                                                value={factionSelected}
                                                label="Factions"
                                                onChange={onChange}
                                                disabled={!editFaction}
                                            >
                                                {
                                                    factions.map(faction =>
                                                        <MenuItem key={uuid()} value={faction.value}>{faction.name}</MenuItem>
                                                    )
                                                }
                                            </Select>
                                        </FormControl>
                                    </CardContent>
                                </CardPerso>
                        )
                    }
                    <ListLegend>
                        {
                            factions.map(faction =>
                                <ListChild key={uuid()}>
                                    <ColorSquare className={faction.value}></ColorSquare>
                                    {faction.name}

                                </ListChild>
                            )
                        }
                    </ListLegend>
                    <LogoContainer>
                        <Logo src={STALKER_logo} alt="logoStalker" />
                        <Logo src={DayZ_Logo} alt="logoDayz" />
                    </LogoContainer>
                </NavBar>
                <Container onClick={onClickContainer} className='map-container'>
                    <Grid
                        x={x}
                        y={y}
                        maxWidth={width}
                        maxHeight={height}
                        factions={factions}
                        edit={editFaction}
                        coordinates={coordinates}
                    />

                    <Annotation
                        values={annotations}
                        edit={editFaction}
                        maxWidth={width}
                        maxHeight={height}
                    />
                    <Image src={Map} alt='map' id='map'/>
                </Container>
            </Wrapper>

            <Modal
                open={openModal}
                onClose={onhandleCloseModal}
                aria-labelledby="annotation-modal-title"
                aria-describedby="annotation-modal-description"

            >
                <Fade in={openModal}>
                    <Box sx={{ ...styleBox, width: 500 }} >
                        <h2 id="parent-modal-title">Ajouter une annotation</h2>
                        <FormGroup onClick={onBlurColorAnnotation}>
                            <TextField
                                id="outlined-basic"
                                placeholder="Titre de l'annotation"
                                variant="outlined"
                                label="Titre de l'annotation"
                                type="text"
                                value={titleAnnotation}
                                onChange={onChangeTitleAnnotation}
                                sx={{ width: '100%', marginBottom: '15px' }}
                            />

                            <TextField
                                label="Description de l'annotation"
                                placeholder="Description de l'annotation"
                                variant="outlined"
                                value={descAnnotation}
                                onChange={onChangeDescAnnotation}
                                multiline
                                maxRows={Infinity}
                                sx={{ width: '100%', marginBottom: '15px' }}
                            />
                            <FormControl sx={{ width: '100%', marginBottom: '15px' }}>
                                <InputLabel id="Icon-select-modal-label">Icon</InputLabel>
                                <Select
                                    labelId="Icon-select-modal-label"
                                    id="Icon-select-modal"
                                    value={iconAnnotation}
                                    label="Icon"
                                    onChange={onChangeIconAnnotation}
                                >
                                    {
                                        icons.map(icon =>
                                            <MenuItem key={uuid()} value={icon.name} name={icon.name}>
                                                <icon.icon /> <Text>{icon.name}</Text>
                                            </MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>
                            <Divider sx={{ width: '100%', marginBottom: '15px' }} />
                            <ColorPicker style={{ width: '100%', marginBottom: '15px' }}>
                                <Picker className='colorPicker' $color={colorAnnotation} onClick={onClickColorAnnotation} />
                                { openColor && (
                                    <ContainerPicker onClick={event => event.stopPropagation()}>
                                        <SketchPicker id="colorPicker-modal" onChange={onChangeColorAnnotation} color={colorAnnotation} />
                                    </ContainerPicker>
                                )}
                                <Label htmlFor="colorPicker-modal" id="colorPicker-modal-label">{colorAnnotation}</Label>
                            </ColorPicker>
                            <Divider sx={{ width: '100%', marginBottom: '15px' }} />
                            <ButtonEdit
                                variant="contained"
                                color="secondary"
                                onClick={onClickAddAnnotation}
                            >
                                Ajouter
                            </ButtonEdit>
                        </FormGroup>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                open={passwordVisible}
                onClose={onhandleClosePasswordModal}
                aria-labelledby="edit-faction-modal-title"
                aria-describedby="edit-faction-modal-description"
            >
                <Fade in={passwordVisible}>
                    <Box sx={{ ...styleBox, width: 500 }}>
                        <h2 id="edit-faction- parent-modal-title">Accès à la modification des zones</h2>
                        <FormControl sx={{ width: '90%' }}>
                            <TextField
                                id="outlined-basic"
                                variant="outlined"
                                label="Mot de passe"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={onChangePassword}
                            />
                            <ButtonEdit
                                variant="contained"
                                color="secondary"
                                onClick={onClickAccess}
                                sx={{ margin: '10px 0' }}
                            >
                                Débloquer
                            </ButtonEdit>
                        </FormControl>
                    </Box>
                </Fade>
            </Modal>
        </Context.Provider>
    );
}

export default App;
