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
