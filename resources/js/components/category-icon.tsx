import {
    IconBaby,
    IconCupSoda,
    IconHeartPulse,
    IconPackage,
    IconPencilRuler,
    IconPopcorn,
    IconUtensils,
} from 'hq-icons';

export default function CategoryIcon({ category }: { category: string }) {
    switch (category) {
        case 'drink':
            return <IconCupSoda />;
        case 'food':
            return <IconUtensils />;
        case 'snack':
            return <IconPopcorn />;
        case 'baby':
            return <IconBaby />;
        case 'office':
            return <IconPencilRuler />;
        case 'care':
            return <IconHeartPulse />;
        default:
        case 'other':
            return <IconPackage />;
    }
}
