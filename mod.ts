/**
 * # Quick Start Guide for Table Sorting
 * Here's a minimal usage example for the table sorting functionality:
 *
 * ## Enable Sorting on a Table:
 * Add `data-sort-table` to your `<table>` element to make it sortable.
 *
 * ## HTML Setup:
 * ```html
 * <table data-sort-table>
 *   <thead>
 *     <tr>
 *       <th data-sort-header="price">Price</th>
 *       <th data-sort-header="name">Name</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td data-sort-label="price" data-sort-value="100">100</td>
 *       <td data-sort-label="name" data-sort-value="Solan">Solan</td>
 *     </tr>
 *     <tr>
 *       <td data-sort-label="price" data-sort-value="200">200</td>
 *       <td data-sort-label="name" data-sort-value="James">James</td>
 *     </tr>
 *   </tbody>
 * </table>
 * ```
 *
 * ## Initialize Sorting:
 * ```javascript
 * document.addEventListener('DOMContentLoaded', () => {
 *   initTableSortable();
 * });
 * ```
 *
 * This setup enables your table headers to sort the corresponding columns in
 * ascending or descending order when clicked. Sorting indicators (`↓`, `↑`) are
 * automatically added next to the sorted column's header to indicate the sort
 * direction.
 *
 * Ensure your `<td>` elements have matching `data-sort-label` attributes and
 * `data-sort-value` attributes for the sorting to work correctly.
 */

export function initTableSortable() {
  document.addEventListener("click", function (e) {
    if (e.target.matches("[data-sort-header]")) {
      sortTableHeaderClick(e);
    }
  });
}
function sortTableHeaderClick(e) {
  const header = e.target;
  const table = header.closest("[data-sort-table]");
  const sortLabel = header.getAttribute("data-sort-header");
  sortTableBy(table, sortLabel);
}

function sortTableBy(table, sortLabel) {
  const previouslySortedByLabel = table.getAttribute("data-sorted-by-label");
  const prevSortOrder = table.getAttribute("data-sort-order");
  const newSortOrder =
    previouslySortedByLabel === sortLabel && prevSortOrder === "asc"
      ? "desc"
      : "asc";

  table.setAttribute("data-sort-order", newSortOrder);
  table.setAttribute("data-sorted-by-label", sortLabel);

  updateSortIndicators(table, sortLabel, newSortOrder);

  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr:not(.panel-hidden)"));
  const sortedRows = sortRows(rows, sortLabel, newSortOrder);

  // Re-append rows in sorted order with minimal DOM manipulation
  sortedRows.forEach((row) => tbody.appendChild(row));
}

function sortRows(rows, sortLabel, order) {
  function getValueFromRow(row, sortLabel) {
    const cell = row.querySelector(`[data-sort-label="${sortLabel}"]`);
    if (!cell) {
      return null;
    }
    return cell.getAttribute("data-sort-value");
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
    return order === "asc" ? aSortValue - bSortValue : bSortValue - aSortValue;
  });
}

function updateSortIndicators(table, sortLabel, sortOrder) {
  const headers = table.querySelectorAll("[data-sort-header]");
  headers.forEach((header) => {
    const icon = sortOrder === "asc" ? " ↓" : " ↑";
    const label = header.getAttribute("data-sort-header");
    header.innerText = header.innerText.replace(/(↓|↑)$/, "") +
      (label === sortLabel ? icon : "");
  });
}
