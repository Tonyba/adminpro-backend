const getMenu = (role = 'USER_ROLE') => {
  const menu = [
    {
      title: 'Dashboard',
      icon: 'mdi mdi-gauge',
      submenu: [
        { title: 'Main', url: '/' },
        { title: 'Charts', url: '/dashboard/charts1' },
        { title: 'ProgressBar', url: '/dashboard/progress' },
        { title: 'Promises', url: '/dashboard/promises' },
        { title: 'Observable', url: '/dashboard/observable' },
      ],
    },

    {
      title: 'Maintenance',
      icon: 'mdi mdi-folder-lock-open',
      submenu: [
        // { title: 'Users', url: '/dashboard/users' },
        { title: 'Hospitals', url: '/dashboard/hospitals' },
        { title: 'Medics', url: '/dashboard/medics' },
      ],
    },
  ];

  if (role === 'ADMIN_ROLE') {
    menu[1].submenu.unshift({ title: 'Users', url: '/dashboard/users' });
  }

  return menu;
};

module.exports = {
  getMenu,
};
