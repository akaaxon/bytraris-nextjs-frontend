export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-y-auto bg-black text-orange-500 font-sans text-xl gap-4">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <div>Loading...</div>
    </div>
  );
}