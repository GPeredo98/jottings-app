import { Injectable } from '@angular/core';

/**
 * Inserts rich content blocks (dividers, tables) into the editor at the
 * current caret position. Uses execCommand so insertion plays nicely with
 * undo history and fires the native `input` event the editor already listens
 * to for autosave.
 */
@Injectable({ providedIn: 'root' })
export class ContentGadgetsService {
  insertDivider(): void {
    document.execCommand('insertHTML', false, '<hr class="qn-hr"><p><br></p>');
  }

  insertTable(): void {
    document.execCommand('insertHTML', false, `${this.buildTableHtml(2, 2)}<p><br></p>`);
  }

  private buildTableHtml(rows: number, cols: number): string {
    const cell = '<td class="qn-td"><br></td>';
    const row = `<tr>${cell.repeat(cols)}</tr>`;
    const body = row.repeat(rows);
    return `<div class="qn-table-wrap" contenteditable="false"><table class="qn-table" contenteditable="true"><tbody>${body}</tbody></table></div>`;
  }
}
