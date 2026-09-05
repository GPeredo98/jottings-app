import { Injectable } from '@angular/core';

const WRAP_SELECTOR = '.qn-table-wrap';
const ZONE_BUTTON_SELECTOR = '.qn-zone-btn';
const ZONE_SIZE = 14;

/**
 * Adds Notion-style hover affordances to `.qn-table-wrap` tables inserted by
 * `ContentGadgetsService`: thin strips at the start, end, and every boundary
 * between rows/columns that reveal a "+" button to grow the table there.
 *
 * Wired up once per editor host via `attach()` (delegated listeners), so it
 * keeps working for tables that get inserted, loaded from storage, or
 * removed later without any per-table setup.
 */
@Injectable({ providedIn: 'root' })
export class TableEditorService {
  private activeWrap: HTMLElement | null = null;

  /**
   * The editor autosaves on every `input` event by reading `innerHTML`, which
   * can fire while a table's hover overlay (row/column "+" zones) is still
   * in the DOM — e.g. typing in a cell while the mouse rests over the table.
   * Strip that transient scaffolding out of a clone so it never gets
   * persisted into note content.
   */
  getPersistableHtml(root: HTMLElement): string {
    if (!root.querySelector('.qn-row-zone, .qn-col-zone')) {
      return root.innerHTML;
    }
    const clone = root.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.qn-row-zone, .qn-col-zone').forEach((zone) => zone.remove());
    return clone.innerHTML;
  }

  attach(root: HTMLElement): () => void {
    const onMouseMove = (event: MouseEvent) => this.handleMouseMove(root, event);
    const onMouseLeave = () => this.setActiveWrap(null);
    const onMouseDown = (event: MouseEvent) => this.handleMouseDown(root, event);

    root.addEventListener('mousemove', onMouseMove);
    root.addEventListener('mouseleave', onMouseLeave);
    root.addEventListener('mousedown', onMouseDown, true);

    return () => {
      root.removeEventListener('mousemove', onMouseMove);
      root.removeEventListener('mouseleave', onMouseLeave);
      root.removeEventListener('mousedown', onMouseDown, true);
      this.setActiveWrap(null);
    };
  }

  private handleMouseMove(root: HTMLElement, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const wrap = target.closest(WRAP_SELECTOR) as HTMLElement | null;
    if (wrap && root.contains(wrap)) {
      this.setActiveWrap(wrap);
    } else {
      this.setActiveWrap(null);
    }
  }

  private handleMouseDown(root: HTMLElement, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const button = target.closest(ZONE_BUTTON_SELECTOR) as HTMLElement | null;
    if (!button) {
      return;
    }
    const zone = button.parentElement as HTMLElement;
    const wrap = zone.closest(WRAP_SELECTOR) as HTMLElement | null;
    const table = wrap?.querySelector('table.qn-table') as HTMLTableElement | null;
    if (!wrap || !table) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (zone.classList.contains('qn-row-zone')) {
      this.insertRow(table, Number(zone.dataset['index']));
    } else {
      this.insertColumn(table, Number(zone.dataset['index']));
    }

    // Overlay zones are UI-only scaffolding and must never end up in the
    // saved note HTML, so tear them down before the input event (which the
    // editor reads `innerHTML` from for autosave) fires.
    this.clearOverlays(wrap);
    root.dispatchEvent(new Event('input', { bubbles: true }));
    this.buildOverlays(wrap);
  }

  private setActiveWrap(wrap: HTMLElement | null): void {
    if (wrap === this.activeWrap) {
      return;
    }
    if (this.activeWrap) {
      this.clearOverlays(this.activeWrap);
    }
    this.activeWrap = wrap;
    if (wrap) {
      this.buildOverlays(wrap);
    }
  }

  private clearOverlays(wrap: HTMLElement): void {
    wrap.querySelectorAll(':scope > .qn-row-zone, :scope > .qn-col-zone').forEach((zone) => zone.remove());
  }

  private buildOverlays(wrap: HTMLElement): void {
    const table = wrap.querySelector('table.qn-table') as HTMLTableElement | null;
    const rows = table ? Array.from(table.rows) : [];
    if (!table || rows.length === 0) {
      return;
    }

    const wrapRect = wrap.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();
    const cols = Array.from(rows[0].cells);

    const rowBoundaries = [tableRect.top, ...rows.map((row) => row.getBoundingClientRect().bottom)];
    rowBoundaries.forEach((y, index) => {
      const zone = document.createElement('div');
      zone.className = 'qn-row-zone';
      zone.dataset['index'] = String(index);
      zone.style.top = `${y - wrapRect.top - ZONE_SIZE / 2}px`;
      zone.style.left = `${tableRect.left - wrapRect.left}px`;
      zone.style.width = `${tableRect.width}px`;
      zone.innerHTML = '<span class="qn-zone-btn" contenteditable="false">+</span>';
      wrap.appendChild(zone);
    });

    const colBoundaries = [tableRect.left, ...cols.map((cell) => cell.getBoundingClientRect().right)];
    colBoundaries.forEach((x, index) => {
      const zone = document.createElement('div');
      zone.className = 'qn-col-zone';
      zone.dataset['index'] = String(index);
      zone.style.left = `${x - wrapRect.left - ZONE_SIZE / 2}px`;
      zone.style.top = `${tableRect.top - wrapRect.top}px`;
      zone.style.height = `${tableRect.height}px`;
      zone.innerHTML = '<span class="qn-zone-btn" contenteditable="false">+</span>';
      wrap.appendChild(zone);
    });
  }

  private insertRow(table: HTMLTableElement, index: number): void {
    const colCount = table.rows[0]?.cells.length ?? 0;
    const body = table.tBodies[0] ?? table;
    const row = document.createElement('tr');
    for (let i = 0; i < colCount; i++) {
      row.appendChild(this.createCell());
    }
    body.insertBefore(row, body.rows[index] ?? null);
  }

  private insertColumn(table: HTMLTableElement, index: number): void {
    Array.from(table.rows).forEach((row) => {
      row.insertBefore(this.createCell(), row.cells[index] ?? null);
    });
  }

  private createCell(): HTMLTableCellElement {
    const cell = document.createElement('td');
    cell.className = 'qn-td';
    cell.appendChild(document.createElement('br'));
    return cell;
  }
}
