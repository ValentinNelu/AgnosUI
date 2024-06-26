import type {AccordionItemWidget, AccordionItemProps, WidgetFactory} from '@agnos-ui/angular-headless';
import {
	BaseWidgetDirective,
	UseDirective,
	UseMultiDirective,
	auBooleanAttribute,
	callWidgetFactory,
	createSimpleClassTransition,
} from '@agnos-ui/angular-headless';
import {type AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject} from '@angular/core';
import {AccordionComponent} from './accordion.component';

@Component({
	selector: 'app-accordion-item',
	imports: [UseDirective, UseMultiDirective],
	template: `
		<div class="collapse collapse-arrow bg-base-200" [auUseMulti]="[widget.directives.accordionItemDirective, widget.directives.transitionDirective]">
			<div
				role="button"
				tabindex="0"
				class="collapse-title text-xl font-medium focus-visible:outline-none"
				[auUse]="widget.directives.toggleDirective"
				(keydown)="onEnter($event)"
			>
				<ng-content select="[header]" />
			</div>
			<div class="collapse-content" [auUse]="widget.directives.bodyContainerAttrsDirective">
				@if (state().shouldBeInDOM) {
					<ng-content />
				}
			</div>
		</div>
	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItemComponent extends BaseWidgetDirective<AccordionItemWidget> implements AfterViewInit {
	@Input()
	itemClass?: AccordionItemProps['itemClass'];
	@Input({transform: auBooleanAttribute})
	itemDestroyOnHide?: AccordionItemProps['itemDestroyOnHide'];
	@Input({transform: auBooleanAttribute})
	itemVisible?: AccordionItemProps['itemVisible'];
	@Input()
	itemId?: AccordionItemProps['itemId'];
	@Output()
	itemVisibleChange = new EventEmitter<boolean>();
	@Output()
	itemShown = new EventEmitter<void>();
	@Output()
	itemHidden = new EventEmitter<void>();

	readonly accordionComponent = inject(AccordionComponent);
	readonly _widget = callWidgetFactory({
		factory: ((arg) => this.accordionComponent.api.registerItem(arg)) as WidgetFactory<AccordionItemWidget>,
		defaultConfig: {
			itemTransition: createSimpleClassTransition({
				showClasses: ['collapse-open'],
				animationPendingShowClasses: ['collapse-open'],
			}),
		},
		events: {
			onItemVisibleChange: (visible) => this.itemVisibleChange.emit(visible),
			onItemHidden: () => this.itemHidden.emit(),
			onItemShown: () => this.itemShown.emit(),
		},
	});
	ngAfterViewInit() {
		queueMicrotask(() => this.api.initDone());
	}

	onEnter(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			this.widget.api.toggle();
		}
	}
}
