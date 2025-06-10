
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowRight, MapPin, Users, FileText, Car } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const quickLinks = [
    { name: 'בית', path: '/', icon: Home, description: 'חזרה לעמוד הראשי' },
    { name: 'לוח בקרה', path: '/driver-map', icon: MapPin, description: 'מפת נהגים בזמן אמת' },
    { name: 'ניהול נהגים', path: '/driver-management', icon: Users, description: 'ניהול וכלי בקרה' },
    { name: 'דוחות', path: '/reports', icon: FileText, description: 'דוחות מתקדמים' },
    { name: 'בקשת נסיעה', path: '/request-ride', icon: Car, description: 'הזמנת נסיעה חדשה' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* 404 Animation */}
        <div className="space-y-4">
          <div className="text-9xl font-bold text-primary/20 animate-pulse">404</div>
          <h1 className="text-4xl font-bold text-foreground">העמוד לא נמצא</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            מצטערים, העמוד שאתה מחפש לא קיים או הועבר למיקום אחר
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={goBack} variant="outline" className="enhanced-button" size="lg">
            <ArrowRight className="h-4 w-4 ml-2" />
            חזור לעמוד הקודם
          </Button>
          <Button asChild className="enhanced-button" size="lg">
            <Link to="/">
              <Home className="h-4 w-4 ml-2" />
              עמוד הבית
            </Link>
          </Button>
        </div>

        {/* Quick Navigation */}
        <Card className="enhanced-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">ניווט מהיר</CardTitle>
            <p className="text-muted-foreground">בחר אחד מהקישורים הבאים כדי להמשיך</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <link.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {link.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground text-right">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-2">זקוק לעזרה?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            אם אתה חושב שזו שגיאה או שאתה זקוק לעזרה נוספת, אנא פנה לתמיכה הטכנית
          </p>
          <Button variant="outline" size="sm" className="enhanced-button">
            צור קשר עם התמיכה
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
