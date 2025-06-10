import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      {/* Header */}
      <header className="bg-white p-6">
        <SidebarTrigger />
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-8" dir="rtl">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-black mb-4">
            ברוכים הבאים למערכת לניהול צי כלי רכב, מוני סיטון בע"מ
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            באמצעות פלטפורמה זו, יתאפשר ניהול אפקטיבי של נהגי הצי, תכנון אופטימלי של מסלולי נסיעה, הגשת בקשות נסיעה, וניתוח שוטף של ביצועי הצי בזמן אמת.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-stretch max-w-3xl mx-auto">
          {/* Request Ride Card */}
          <Card className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <CardHeader>
              <Car size={48} className="text-red-600 mb-4" />
              <CardTitle className="text-2xl font-semibold text-black mb-2">
                בקשת נסיעה
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <Button
                asChild
                className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-md mt-4 w-full"
              >
                <Link to="/request-ride">בצע בקשה</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Driver Management Card */}
          <Card className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <CardHeader>
              <Users size={48} className="text-red-600 mb-4" />
              <CardTitle className="text-2xl font-semibold text-black mb-2">
                ניהול נהגים
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <Button
                asChild
                className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-md mt-4 w-full"
              >
                <Link to="/driver-management">נהל צי</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Statistics Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-black mb-6">
            סטטיסטיקות צי עדכניות
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-black">
              <p className="text-xl font-bold">12</p>
              <p className="text-sm text-gray-600">סה"כ כלי רכב זמינים</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-black">
              <p className="text-xl font-bold">8</p>
              <p className="text-sm text-gray-600">נסיעות מתוכננות היום</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-black">
              <p className="text-xl font-bold">15</p>
              <p className="text-sm text-gray-600">נהגים פעילים</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage; 