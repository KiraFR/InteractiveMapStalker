import React, { useEffect, useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

import { GiWineBottle, GiScorpion } from "react-icons/gi";
import { BsBoxArrowDown, BsArrowsFullscreen } from "react-icons/bs";
import { MdCrueltyFree } from "react-icons/md";
import { CgDanger } from "react-icons/cg";
import { AiTwotoneHome } from "react-icons/ai";

import {
    FaReact,
    FaAnkh,
    FaHippo,
    FaEarlybirds,
    FaPoo,
    FaRadiation
} from  "react-icons/fa";

import { asyncForEach } from './utils/utils';
import map from './map.png';
import './App.css';

import Grid from './components/Grid';
import Annotation from './components/Annotation';
import Context from './components/Context';

const uuid = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};


const icons = [
    {
        name: 'Ecologiste ',
        icon: FaReact,
    },
    {
        name: 'Monolith',
        icon: FaAnkh,
    },
    {
        name: 'Devoir',
        icon: FaHippo,
    },
    {
        name: 'Mercenaire ',
        icon: FaEarlybirds,
    },
    {
        name: 'Bandit',
        icon: FaPoo,
    },
    {
        name: 'Loner',
        icon: FaRadiation,
    },
    {
        name: 'Militaire',
        icon: GiWineBottle,
    },
    {
        name: 'Renega',
        icon: GiScorpion,
    },
    {
        name: 'Extraction',
        icon: BsBoxArrowDown,
    },
    {
        name: 'Cible',
        icon: BsArrowsFullscreen,
    },
    {
        name: 'Liberté',
        icon: MdCrueltyFree,
    },
    {
        name: 'Zone à risque',
        icon: CgDanger,
    },
    {
        name: 'Maison',
        icon: AiTwotoneHome,
    },
];

const CardPerso = styled(Card) `
    margin: 10px 0;
`

const Image = styled.img `
    height: 100vh;
`;

const Container = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    flex-wrap: wrap;
    align-content: center;
    justify-content: flex-start;
    flex-direction: column;
    background-color: #2E2E30;
    position: relative;
`;

const Wrapper = styled.div`
    height: 100vh;
    display: flex;
    background-color: #2E2E30;
`;

const NavBar = styled.div`
    padding: 6px;
    box-shadow: 0 0 10px 1px rgb(0 0 0 / 30%);
    background-color: #4a4a4a;
    display: flex;
    flex-direction: column;
    width: 220px;
    min-width: 220px;
    z-index: 1;
`;

const ButtonEdit = styled(Button) `
    background-color: rgb(144, 202, 249) !important;
    color: black !important;
    font-weight: 700 !important;
`;

const Text = styled.span`
    margin-left: 10px;
`;

const x = 9;
const y = 12;

const factions = [
    {
        name : 'Aucune faction',
        value : 'none'
    },
    {
        name : 'Mercenaire',
        value : 'mercenary'
    },
    {
        name : 'Militaire',
        value : 'military'
    },
    {
        name : 'Devoir',
        value : 'duty'
    },
    {
        name : 'Liberté',
        value : 'freedom'
    },
    {
        name : 'Bandits',
        value : 'brotherhood'
    },
    {
        name : 'Clear Sky',
        value : 'csk'
    }
];

const styleBox = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function App() {

    const [ width, setWidth ] = useState(null);
    const [ height, setHeight ] = useState(null);
    const [ editFaction, setEditFaction] = useState(false);
    const [ selected, setSelected ] = useState(null);
    const [ factionSelected, setFactionSelected ] = useState('');
    const [ coordinates, setCoordinates ] = useState([]);
    const [ annotations, setAnnotations ] = useState([]);

    const [ newAnnotation, setNewAnnotation] = useState(null);
    const [ openModal, setOpenModal ] = useState(false);

    const resizeEvent = useCallback(() => {
        const picture = document.getElementById('map');
        if(picture.clientWidth > 0){
            setWidth(picture.clientWidth);
            setHeight(picture.clientHeight);
        } else {
            window.setTimeout(resizeEvent, 100);
        }

    }, [ setWidth, setHeight ]);

    useEffect(() => {
        window.addEventListener('resize', resizeEvent);
        resizeEvent();
    }, [ resizeEvent ]);

    const onClick= useCallback(() => {
        setEditFaction(!editFaction);
    }, [ editFaction, setEditFaction ]);

    const onSelectFaction = useCallback((f) => {
        const oldCoordinates = [ ...coordinates ];

        const tmp = oldCoordinates.map(coordinateX =>
            coordinateX.map(coord => {
                if(coord.coordinates === selected){
                    return { ...coord, faction: f }
                } else {
                    return coord;
                }
            })
        );
        setCoordinates(tmp);
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
        setOpenModal(false);
    }, [ setOpenModal ]);

    const onClickContainer = useCallback(event => {
        if (!editFaction) {
            const rect = event.target.getBoundingClientRect();
            const uuidAnnotion = uuid();
            const xPos = ((event.clientX - rect.left) / width) * 100;
            const yPos = ((event.clientY - rect.top) / height) * 100;

            setNewAnnotation({ x: xPos, y: yPos, uuid : uuidAnnotion });
            setOpenModal(true);
        }
    }, [ width, height, editFaction, setNewAnnotation, setOpenModal ]);

    useEffect(() => {
        const xArray = [...Array(x + 1).keys()];
        const yArray = [...Array(y + 1).keys()];
        xArray.shift();
        yArray.shift();

        const init = async () => {
            let tmp = [ ];
            await asyncForEach(xArray, async xValue => {
                const charX = String.fromCharCode(64 + xValue);
                const arrayX = [];
                await asyncForEach(yArray, async (yValue, index) => {
                    const coordinatesXY = `${charX}${yValue}`;
                    arrayX.push({
                        coordinates : coordinatesXY,
                        x: charX,
                        y: yValue,
                        faction: '',
                        selected: false
                    })
                });
                tmp = [ ...tmp, arrayX ];
            });
            setCoordinates(tmp);
        };
        init();
    }, [ setCoordinates ]);

    return (
        <Context.Provider value={providerValue}>
            <Wrapper>
                <NavBar>
                    <ButtonEdit
                        variant="contained"
                        color="secondary"
                        onClick={onClick}
                    >
                        {editFaction ? 'Bloquer Factions' : 'Modifier Factions'}
                    </ButtonEdit>

                    <CardPerso>
                        <CardHeader
                            title="Faction"
                            subheader="Choisis la faction qui gère cette zone"
                        />
                        <CardContent>
                            <FormControl sx={{ width: '90%'  }} disabled={!editFaction}>
                                <Select
                                    className={!editFaction ? 'Mui-disabled' : ''}
                                    id="select-faction"
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
                    <Image src={map} alt='map' id='map'/>
                </Container>
            </Wrapper>

            <Modal
              open={openModal}
              onClose={onhandleCloseModal}
              aria-labelledby="annotation-modal-title"
              aria-describedby="annotation-modal-description"
            >
                <Fade in={openModal}>
                    <Box sx={{ ...styleBox, width: 500 }}>
                        <h2 id="parent-modal-title">Text in a modal</h2>
                            <FormControl sx={{ width: '90%' }}>
                                <Select
                                    id="select-faction"
                                    value={factionSelected}
                                    label="Faction"
                                    onChange={onChange}
                                >
                                    {
                                        icons.map(icon =>
                                            <MenuItem key={uuid()} value={icon.name}>
                                                <icon.icon /> <Text>{icon.name.replaceAll("Gi", "")}</Text>
                                            </MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>
                    </Box>
                </Fade>
            </Modal>

        </Context.Provider>
    );
}

export default App;
