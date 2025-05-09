
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-paperWhite border-t border-border py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="font-jp font-bold text-lg text-plum mr-2">辞書</span>
            <span className="font-bold text-lg text-inkBlack">JishoDict</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
            <Link to="/categories" className="hover:text-foreground transition-colors">
              Danh mục
            </Link>
            <a href="#" className="hover:text-foreground transition-colors">
              Về chúng tôi
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Liên hệ
            </a>
          </nav>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} JishoDict. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
