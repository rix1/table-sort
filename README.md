# @rix1/table-sort

Effortlessly add sorting capabilities to your HTML tables with `@rix1/table-sort`. This lightweight, no-dependency library allows users to make table columns sortable with just a few data attributes and a simple initialization script.

## Features

- Easy to integrate with any HTML table.
- Supports sorting by multiple data types (string, number).
- Automatic sorting indicator icons for visual cues.
- Minimal setup required.

## Quick Start

1. **Include the library in your project:**

   If you're using a module bundler like Webpack or Rollup, you can import `@rix1/table-sort` directly into your JavaScript file.

   ```javascript
   import { initTableSortable } from "@rix1/table-sort";
   ```

   Alternatively, you can include it directly in your HTML via a `<script>` tag, assuming the library is accessible in your project's directory structure.

2. **Prepare your HTML table:**

   Add `data-sort-table` to your `<table>` element and specify which columns should be sortable by adding `data-sort-header` to the corresponding `<th>` elements.

   ```html
   <table data-sort-table>
     <thead>
       <tr>
         <th data-sort-header="price">Price</th>
         <th data-sort-header="name">Name</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td data-sort-label="price" data-sort-value="100">100</td>
         <td data-sort-label="name" data-sort-value="Solan">Solan</td>
       </tr>
       <!-- Additional rows -->
     </tbody>
   </table>
   ```

3. **Initialize the sorting functionality:**

   After your page content has loaded, call `initTableSortable()` to activate sorting.

   ```javascript
   document.addEventListener("DOMContentLoaded", () => {
     initTableSortable();
   });
   ```

## How It Works

The library listens for click events on `<th>` elements with the `data-sort-header` attribute. Clicking a sortable header toggles the sorting order for the corresponding column, alternating between ascending and descending. Sorting indicators (`↓`, `↑`) are automatically added next to the sorted column's header to visually indicate the sorting direction.

Ensure your `<td>` elements have matching `data-sort-label` attributes and `data-sort-value` attributes for accurate sorting.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or create an issue for any bugs, feature requests, or improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

This README provides a clear and comprehensive guide for potential users of your library, from setup to implementation. Adjustments can be made based on your specific requirements or additional features you might add in the future.
