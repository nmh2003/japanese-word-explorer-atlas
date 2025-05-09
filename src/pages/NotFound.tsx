
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-9xl font-bold text-plum">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-6">Trang không tìm thấy</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển đến một URL khác.
      </p>
      <Button asChild>
        <Link to="/">Quay về trang chủ</Link>
      </Button>
    </div>
  );
};

export default NotFound;
