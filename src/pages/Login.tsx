
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, User, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      toast({
        title: "התחברות בוצעה בהצלחה",
        description: "אתה מועבר לעמוד הראשי...",
      });
      setIsLoading(false);
      // Here you would normally redirect to the main app
      window.location.href = '/';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <Car className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">התחברות למערכת</h1>
            <p className="text-muted-foreground mt-2">מערכת ניהול צי - מוני סיטון בע״מ</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="enhanced-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-foreground">כניסה לחשבון</CardTitle>
            <CardDescription className="text-center">
              הזן את פרטי ההתחברות שלך כדי לגשת למערכת
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">דוא״ל</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="הזן כתובת דוא״ל"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pr-10 modern-input"
                    required
                    dir="ltr"
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">סיסמה</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="הזן סיסמה"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10 pl-10 modern-input"
                    required
                    dir="ltr"
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  שכחת סיסמה?
                </Link>
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-sm">זכור אותי</Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full enhanced-button"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Shield className="h-4 w-4 ml-2" />
                    התחבר למערכת
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-muted-foreground">
              אין לך חשבון?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 transition-colors">
                הרשם כעת
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Security Badge */}
        <div className="text-center">
          <Badge variant="outline" className="text-xs border-green-500/20 bg-green-500/5">
            <Shield className="h-3 w-3 ml-1 text-green-600" />
            חיבור מאובטח SSL
          </Badge>
        </div>

        {/* Demo Credentials */}
        <Card className="enhanced-card bg-muted/30">
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm text-center mb-2">פרטי התחברות לדמו</h4>
            <div className="space-y-1 text-xs text-center text-muted-foreground">
              <p>דוא״ל: demo@monisiton.co.il</p>
              <p>סיסמה: demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
