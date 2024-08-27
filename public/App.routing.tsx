// import React, { Suspense } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// // Lazy-load route components
// const Login = React.lazy(() => import(/* webpackChunkName: "popuup" */'./popup/Login'));
// // const AboutPage = React.lazy(() => import('./pages/AboutPage'));
// // Add more routes as needed


// function App() {
//     return (
//       <Router>
//         <Suspense fallback={<div>Loading...</div>}>
//           <Switch>
//             <Route exact path="/" component={HomePage} />
//             <Route path="/about" component={AboutPage} />
//             {/* Define more routes as needed */}
//           </Switch>
//         </Suspense>
//       </Router>
//     );
//   }