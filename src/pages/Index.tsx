
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { categories } from '@/data/dictionary';

const Index = () => {
  // Display just the first 6 categories on the homepage
  const featuredCategories = categories.slice(0, 6);
  
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-plum">Từ điển</span> Tiếng Nhật Việt
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Khám phá và học hàng ngàn từ vựng tiếng Nhật với phát âm, ví dụ và cách sử dụng chính xác.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-plum hover:bg-plum/90">
            <Link to="/categories">Khám phá danh mục</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#">Học hôm nay</a>
          </Button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Danh mục phổ biến</h2>
          <Button asChild variant="ghost" className="text-plum">
            <Link to="/categories">Xem tất cả</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCategories.map(category => (
            <Link to={`/categories/${category.id}`} key={category.id}>
              <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                <div className="h-32 bg-secondary flex items-center justify-center">
                  <span className="text-4xl font-jp font-bold text-plum">{category.nameJp}</span>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
                  <div className="text-xs font-medium text-muted-foreground">
                    {category.wordCount} từ vựng
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Bắt đầu học <span className="text-plum">ngay hôm nay</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Với hơn 200+ từ vựng và ví dụ thực tế, hãy nâng cao vốn từ vựng tiếng Nhật của bạn một cách hiệu quả.
        </p>
        <Button asChild size="lg" className="bg-plum hover:bg-plum/90">
          <Link to="/categories">Bắt đầu học ngay</Link>
        </Button>
      </section>
    </div>
  );
};

export default Index;
