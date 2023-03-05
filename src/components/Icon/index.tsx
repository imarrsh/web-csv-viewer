import * as MiniIcons from '@heroicons/react/20/solid';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as SolidIcons from '@heroicons/react/24/solid';
import { twMerge as tw } from 'tailwind-merge';

interface OutlineIcon {
	variant?: 'outline';
	name: keyof typeof OutlineIcons;
}

interface SolidIcon {
	variant?: 'solid';
	name: keyof typeof SolidIcons;
}

interface MiniIcon {
	variant?: 'mini';
	name: keyof typeof MiniIcons;
}

type IconProps =
	| {
			className?: string;
	  } & (OutlineIcon | SolidIcon | MiniIcon);

const Icon = ({ className, name, variant = 'outline' }: IconProps) => {
	let I;
	switch (variant) {
		case 'solid':
			I = SolidIcons[name];
			break;
		case 'mini':
			I = MiniIcons[name];
			break;
		default:
			I = OutlineIcons[name];
	}
	return <I className={tw('h-4 w-4', className)} />;
};

export default Icon;
