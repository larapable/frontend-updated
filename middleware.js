import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req });

  console.log("Token in middleware:", token);

  // Define your protected routes and their required roles
  const protectedRoutes = {
    '/swot': ['faculty','headOfficer'], 
    '/stratmap': ['faculty','headOfficer'], 
    '/inputgoals': ['faculty','headOfficer'],
    '/profile': ['faculty','headOfficer'],
    '/password': ['faculty','headOfficer'],
    '/userprofile/edit': ['faculty','headOfficer'],
    '/profile/edit': ['headOfficer'],
    '/reports':['faculty','headOfficer'],
    '/feedback':['faculty','headOfficer'],
    '/admindashboard':['admin'],
    '/registerdepartment':['admin'],
    '/listofusers':['admin'],
    '/edituserprofile':['headOfficer'],
    '/adminlistofusers':['admin'],
  };

  const pathname = req.nextUrl.pathname;


  if (pathname in protectedRoutes) {

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url)); 
    }

    const requiredRoles = protectedRoutes[pathname];
    if (!requiredRoles.includes(token.role)) { 
      return NextResponse.redirect(new URL('/unauthorized', req.url)); 
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/swot', 
    '/stratmap', 
    '/inputgoals', 
    '/profile', 
    '/password', 
    '/userprofile/edit', 
    '/profile/edit',
    '/reports',  
    '/feedback', 
    '/admindashboard',
    '/registerdepartment',
    '/listofusers',
    '/edituserprofile',
    '/adminlistofusers',
  ]
};