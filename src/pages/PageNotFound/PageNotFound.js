const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center px-2 py-10">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Oops! We weren't able to find that page.
        </h1>
        <p className="text-center">Please check the address and try again.</p>
      </div>
    </div>
  );
};

export default PageNotFound;
