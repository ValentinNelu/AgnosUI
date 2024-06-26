import type {TransitionFn} from '@agnos-ui/core/services/transitions/baseTransitions';
import {createCollapseTransition, type CollapseConfig} from '@agnos-ui/core/services/transitions/collapse';

const verticalConfig: CollapseConfig = {
	dimension: 'height',
	hideClasses: ['collapse'],
	showClasses: ['collapse', 'show'],
	animationPendingClasses: ['collapsing'],
};
const horizontalConfig: CollapseConfig = {
	dimension: 'width',
	hideClasses: ['collapse', 'collapse-horizontal'],
	showClasses: ['collapse', 'collapse-horizontal', 'show'],
	animationPendingClasses: ['collapsing', 'collapse-horizontal'],
};

export const collapseVerticalTransition: TransitionFn = createCollapseTransition(verticalConfig);
export const collapseHorizontalTransition: TransitionFn = createCollapseTransition(horizontalConfig);
