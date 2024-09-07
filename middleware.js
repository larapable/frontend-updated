export {default} from "next-auth/middleware"

export const config = {
    matcher: [
      '/swot', 
      '/stratmap', 
      '/inputgoals', 
      '/profile', 
      '/password', 
      '/userprofile', 
      '/reports',  
      '/feedback', 
      '/admindashboard',
    ]
  };