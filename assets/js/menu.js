export default [
  'General',
  [
    {
      to: '/',
      icon: 'desktop-mac',
      label: 'Dashboard',
    },
  ],
  'Examples',
  [
    {
      to: '/policies',
      label: 'Policies',
      icon: 'table',
    },
    {
      to: '/occurrences',
      label: 'Occurrences',
      icon: 'table',
    },
    {
      to: '/policies/86084/occurrences',
      label: "Test P's Occurences",
      icon: 'table',
    },
    {
      to: '/forms',
      label: 'Forms',
      icon: 'square-edit-outline',
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: 'account-circle',
    },
    {
      to: '/login',
      label: 'Login',
      icon: 'lock',
    },
    {
      label: 'Submenus',
      subLabel: 'Submenus Example',
      icon: 'view-list',
      menu: [
        {
          href: '#void',
          label: 'Sub-item One',
        },
        {
          href: '#void',
          label: 'Sub-item Two',
        },
      ],
    },
  ],
]
