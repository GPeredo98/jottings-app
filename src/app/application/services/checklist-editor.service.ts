import { Injectable, inject } from '@angular/core';
import { ContentGadgetsService } from './content-gadgets.service';

const CHECKBOX_SELECTOR = '.qn-checkbox';
const CHECKLIST_ITEM_SELECTOR = '.qn-checklist-item';

@Injectable({ providedIn: 'root' })
export class ChecklistEditorService {
  private readonly contentGadgets = inject(ContentGadgetsService);

  attach(root: HTMLElement): () => void {
    const onClick = (event: MouseEvent) => this.handleClick(root, event);
    const onKeydown = (event: KeyboardEvent) => this.handleKeydown(root, event);
    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKeydown);
    return () => {
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeydown);
    };
  }

  private handleClick(root: HTMLElement, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const checkbox = target.closest(CHECKBOX_SELECTOR) as HTMLElement | null;
    if (!checkbox || !root.contains(checkbox)) {
      return;
    }

    event.preventDefault();
    const checked = checkbox.getAttribute('aria-checked') === 'true';
    checkbox.setAttribute('aria-checked', String(!checked));
    root.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private handleKeydown(root: HTMLElement, event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    const anchorNode = document.getSelection()?.anchorNode;
    const anchorElement = anchorNode
      ? anchorNode.nodeType === Node.ELEMENT_NODE
        ? (anchorNode as Element)
        : anchorNode.parentElement
      : null;
    const checklistItem = anchorElement?.closest(CHECKLIST_ITEM_SELECTOR);
    if (!checklistItem || !root.contains(checklistItem)) {
      return;
    }

    event.preventDefault();

    if (this.isChecklistTextEmpty(checklistItem)) {
      this.exitChecklist(root, checklistItem);
      return;
    }

    this.contentGadgets.insertChecklistItem();
  }

  private isChecklistTextEmpty(checklistItem: Element): boolean {
    const text = checklistItem.querySelector('.qn-checklist-text')?.textContent ?? '';
    return text.replace(/ /g, '').trim().length === 0;
  }

  private exitChecklist(root: HTMLElement, checklistItem: Element): void {
    const paragraph = document.createElement('p');
    paragraph.appendChild(document.createElement('br'));
    checklistItem.replaceWith(paragraph);

    const selection = document.getSelection();
    if (selection) {
      const range = document.createRange();
      range.setStart(paragraph, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    root.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
