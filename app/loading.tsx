export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      <p className="text-muted-foreground text-lg font-medium animate-pulse">
        데이터를 불러오는 중입니다...
      </p>
    </div>
  );
}
