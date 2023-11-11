export interface BackButtonProps {
  /**
   * @displayName Back To URL
   * @tooltip Controls the URL the back button navigates to
   */
  backToUrl: string;
}

export const BackButton = ({ backToUrl }: BackButtonProps) => {
  return (
    <a href={backToUrl}>
      <button
        type="button"
        aria-label="Go back to articles"
        className="group flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="h-4 w-4 stroke-gray-500 transition group-hover:stroke-gray-700"
        >
          <path
            d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </button>
    </a>
  );
};
