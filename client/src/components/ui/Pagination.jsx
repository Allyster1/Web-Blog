import Button from "./Button";

/**
 * Reusable Pagination Component
 * @param {Object} pagination - Pagination object with page, pages, total, limit
 * @param {Function} onPageChange - Callback function when page changes
 * @param {string} className - Additional CSS classes
 */
export default function Pagination({
  pagination,
  onPageChange,
  className = "",
}) {
  if (!pagination || !pagination.pages || pagination.pages <= 1) {
    return null;
  }

  const { page = 1, pages, total = 0, limit = 9 } = pagination;

  // Calculate start and end items
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className={`flex flex-col items-center gap-4 my-8 ${className}`}>
      {total > 0 && (
        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {total} result
          {total !== 1 ? "s" : ""}
        </div>
      )}

      <div className="flex items-center justify-center gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          Previous
        </Button>

        <span className="flex items-center px-4 text-sm text-gray-600">
          Page {page} of {pages}
        </span>

        <Button
          type="button"
          variant="secondary"
          onClick={() => onPageChange(Math.min(pages, page + 1))}
          disabled={page >= pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
