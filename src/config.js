import { GiWineBottle, GiScorpion } from "react-icons/gi";
import { BsBoxArrowDown, BsArrowsFullscreen } from "react-icons/bs";
import { MdCrueltyFree } from "react-icons/md";
import { CgDanger } from "react-icons/cg";
import { AiTwotoneHome } from "react-icons/ai";
import { FaReact, FaAnkh, FaHippo, FaEarlybirds, FaPoo, FaRadiation } from "react-icons/fa";

const x = 9;
const y = 12;

const icons = [
    {
        name: 'Ecologiste',
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
        name: 'Mercenaire',
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
    },
    {
        name : 'Ecologiste',
        value : 'ecologist'
    }
];

export {
    x,
    y,
    icons,
    factions
};
