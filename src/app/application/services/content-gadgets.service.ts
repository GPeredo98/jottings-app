import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ContentGadgetsService {
  insertDivider(): void {
    document.execCommand('insertHTML', false, '<hr class="qn-hr"><p><br></p>');
  }

  insertTable(): void {
    document.execCommand('insertHTML', false, `${this.buildTableHtml(2, 2)}<p><br></p>`);
  }

  insertChecklistItem(): void {
    const selection = document.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const anchor = range ? this.closestElement(range.startContainer) : null;
    const editorRoot = anchor?.closest<HTMLElement>('[contenteditable="true"]');
    if (!selection || !range || !anchor || !editorRoot) {
      return;
    }

    const currentLine = anchor.closest('.qn-checklist-item, p, div');
    const referenceBlock = currentLine && currentLine !== editorRoot ? currentLine : null;

    const item = this.createChecklistItemElement();
    if (referenceBlock?.parentElement) {
      referenceBlock.parentElement.insertBefore(item, referenceBlock.nextSibling);
    } else {
      editorRoot.appendChild(item);
    }

    const textNode = item.querySelector('.qn-checklist-text')?.firstChild;
    if (textNode) {
      const textRange = document.createRange();
      textRange.setStart(textNode, textNode.textContent?.length ?? 0);
      textRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(textRange);
    }

    editorRoot.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private createChecklistItemElement(): HTMLDivElement {
    const item = document.createElement('div');
    item.className = 'qn-checklist-item';

    const checkbox = document.createElement('span');
    checkbox.className = 'qn-checkbox';
    checkbox.setAttribute('contenteditable', 'false');
    checkbox.setAttribute('role', 'checkbox');
    checkbox.setAttribute('aria-checked', 'false');

    const text = document.createElement('span');
    text.className = 'qn-checklist-text';
    text.appendChild(document.createTextNode(' '));

    item.append(checkbox, text);
    return item;
  }

  private closestElement(node: Node): Element | null {
    return node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  }

  private buildTableHtml(rows: number, cols: number): string {
    const cell = '<td class="qn-td"><br></td>';
    const row = `<tr>${cell.repeat(cols)}</tr>`;
    const body = row.repeat(rows);
    return `<div class="qn-table-wrap" contenteditable="false"><table class="qn-table" contenteditable="true"><tbody>${body}</tbody></table></div>`;
  }
}
