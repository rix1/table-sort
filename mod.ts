/**
 * Interface for Table Sort Data
 */
interface SortData {
  label: string;
  value: string | number;
}

/**
 * ## Quick Start Guide for Table Sorting
 * This setup enables your table headers to sort the corresponding columns in
 * ascending or descending order when clicked. Sorting indicators (`↓`, `↑`) are
 * automatically added next to the sorted column's header to indicate the sort
 * direction. State is stored in the DOM itself and it works with multiple tables
 * on the same page.
 *
 * Ensure your `<td>` elements have matching `data-sort-label` attributes and
 * `data-sort-value` attributes for the sorting to work correctly.
 *
 * ### Minimal Example
 *
 * #### Step 1: Add data- attributes to your HTML
 *
 * Add `data-sort-table` to your top table element like so: `<table data-sort-table>`.
 * For your `th` and `td` elements, here's the attributes you need to set
 *
 * <table data-sort-table>
 *   <thead>
 *     <tr>
 *       <th data-sort-header="price"><pre>data-sort-header="price"</pre></th>
 *       <th data-sort-header="name"><pre>data-sort-header="name"</pre></th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td data-sort-label="price" data-sort-value="100"><pre>data-sort-label="price" data-sort-value="100"</pre></td>
 *       <td data-sort-label="name" data-sort-value="Solan"><pre>data-sort-label="name" data-sort-value="Solan"</pre></td>
 *     </tr>
 *     <tr>
 *       <td data-sort-label="price" data-sort-value="200"><pre>data-sort-label="price" data-sort-value="200"</pre></td>
 *       <td data-sort-label="name" data-sort-value="James"><pre>data-sort-label="name" data-sort-value="James"</pre></td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * #### Step 2: Initialize Sorting
 * Somewhere on your page (or in a existing bundle), add the following script:
 * ```javascript
 * document.addEventListener('DOMContentLoaded', () => {
 *   initTableSortable();
 * });
 * ```
 * @returns This will not return anything. It just attaches event listeners to all table headers with `data-sort-header` attribute.
 */
export function initTableSortable() {
  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.matches("[data-sort-header]")) {
      sortTableHeaderClick(target);
    }
  });
}

/**
 * Sorts table header on click
 * @param target - Clicked table header element
 */
function sortTableHeaderClick(target: HTMLElement) {
  const header = target;
  const table = header.closest("[data-sort-table]") as HTMLElement;
  const sortLabel = header.getAttribute("data-sort-header")!;
  sortTableBy(table, sortLabel);
}

/**
 * Sorts array of table rows
 * @param rows - Array of table row elements
 * @param sortLabel - Label to sort by
 * @param order - Sort order (asc/desc)
 * @returns Sorted array of table row elements
 */
function sortRows(
  rows: HTMLTableRowElement[],
  sortLabel: string,
  order: string,
): HTMLTableRowElement[] {
  function getValueFromRow(
    row: HTMLTableRowElement,
    sortLabel: string,
  ): SortData["value"] {
    const cell = row.querySelector(`[data-sort-label="${sortLabel}"]`);
    if (!cell) {
      return 0;
    }
    return cell.getAttribute("data-sort-value") as SortData["value"];
  }

  return rows.sort((a, b) => {
    const aValue = getValueFromRow(a, sortLabel);
    const bValue = getValueFromRow(b, sortLabel);

    // force all null rows to end regardless of order
    if (!aValue && !bValue) {
      return 0;
    } else if (!aValue) {
      return 1;
    } else if (!bValue) {
      return -1;
    }

    const aSortValue = isNaN(Number(aValue)) ? aValue : Number(aValue);
    const bSortValue = isNaN(Number(bValue)) ? bValue : Number(bValue);

    if (typeof aSortValue === "string" && typeof bSortValue === "string") {
      return order === "asc"
        ? aSortValue.localeCompare(bSortValue)
        : bSortValue.localeCompare(aSortValue);
    }
    if (typeof aSortValue === "number" && typeof bSortValue === "number") {
      return order === "asc"
        ? aSortValue - bSortValue
        : bSortValue - aSortValue;
    }
    return 0;
  });
}

/**
 * Updates sort indicator icons on table headers
 * @param table - Table element
 * @param sortLabel - Label of the sorted column
 * @param sortOrder - Sort order (asc/desc)
 */
function updateSortIndicators(
  table: HTMLElement,
  sortLabel: string,
  sortOrder: string,
) {
  const headers = table.querySelectorAll(
    "[data-sort-header]",
  ) as NodeListOf<HTMLElement>;
  headers.forEach((header) => {
    const icon = sortOrder === "asc" ? " ↓" : " ↑";
    const label = header.getAttribute("data-sort-header");
    header.innerText = header.innerText.replace(/(↓|↑)$/, "") +
      (label === sortLabel ? icon : "");
  });
}

/**
 * Sorts table based on clicked header
 * @param table - Table element to sort
 * @param sortLabel - Label of the clicked header
 */
function sortTableBy(table: HTMLElement, sortLabel: string) {
  const previouslySortedByLabel = table.getAttribute("data-sorted-by-label");
  const prevSortOrder = table.getAttribute("data-sort-order");
  const newSortOrder =
    previouslySortedByLabel === sortLabel && prevSortOrder === "asc"
      ? "desc"
      : "asc";

  table.setAttribute("data-sort-order", newSortOrder);
  table.setAttribute("data-sorted-by-label", sortLabel);

  updateSortIndicators(table, sortLabel, newSortOrder);

  const tbody = table.querySelector("tbody")!;
  const rows = Array.from(
    tbody.querySelectorAll("tr:not(.panel-hidden)"),
  ) as HTMLTableRowElement[];
  const sortedRows = sortRows(rows, sortLabel, newSortOrder);

  // Re-append rows in sorted order with minimal DOM manipulation
  sortedRows.forEach((row) => tbody.appendChild(row));
}
