import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule, SeparatorHorizontal, Table } from 'lucide-angular';
import { ContentGadgetsService } from '../../../application/services/content-gadgets.service';

@Component({
  selector: 'qn-gadgets-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  templateUrl: './gadgets-toolbar.component.html',
})
export class GadgetsToolbarComponent {
  private readonly gadgets = inject(ContentGadgetsService);

  protected readonly dividerIcon = SeparatorHorizontal;
  protected readonly tableIcon = Table;

  /** Keeps the editor selection alive when a toolbar button is pressed. */
  protected preventFocusLoss(event: MouseEvent): void {
    event.preventDefault();
  }

  protected insertDivider(): void {
    this.gadgets.insertDivider();
  }

  protected insertTable(): void {
    this.gadgets.insertTable();
  }
}
