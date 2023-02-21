module.exports = {
  plugins: {
    '@fullhuman/postcss-purgecss': {
      content: [
        './app-components/src/app/*.*',
        './docs/assets/js/*.js',
        './docs/content-pages/*.*',
        './docs/layouts/**/*.html',
        './docs/static/assets/js/*.js',
      ],
      safelist: [
        'alert',
        'arrow',
        'bd-clipboard',
        'border',
        'border-0',
        'border-bottom',
        'border-right',
        'breadcrumb',
        'bs-tooltip-bottom',
        'bs-tooltip-top',
        'btn-clipboard',
        'btn-danger',
        'btn-outline-dark',
        'btn-outline-primary',
        'btn-outline-secondary',
        'btn-primary',
        'btn-secondary',
        'btn-to-top',
        'btn',
        'card-body',
        'card-footer',
        'card',
        'chip',
        'chip-solid',
        'chip-sm',
        'chroma',
        'cl',
        'clearfix',
        'code',
        'col-11',
        'col-12',
        'col-lg-2',
        'col-lg-3',
        'col-lg-4',
        'col-lg-6',
        'col-lg-9',
        'col-md-2',
        'col-md-3',
        'col-md-4',
        'col-md-5',
        'col-md-7',
        'col-md-8',
        'col-md-10',
        'col-sm-1',
        'col-sm-3',
        'col-sm-4',
        'col-sm-6',
        'col-sm-7',
        'col-sm-8',
        'col-sm-11',
        'col-xl-4',
        'col-xl-8',
        'col',
        'container-fluid',
        'container',
        'copy-to-clipboard',
        'custom-control',
        'custom-control-input',
        'custom-switch',
        'd-block',
        'd-flex',
        'd-none',
        'd-print-none',
        'display-1',
        'display-2',
        'display-3',
        'dropdown',
        'dropdown-item',
        'dropdown-menu',
        'dropdown-menu-icons',
        'dropdown-menu-right',
        'dropdown-toggle',
        'fade',
        'filter-invert',
        'fixed-top',
        'flex-column',
        'flex-nowrap',
        'flex-sm-row',
        'flex-xl-row',
        'float-right',
        'font-weight-bold',
        'footer',
        'form-group',
        'form-group-item',
        'h-100',
        'highlight',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'input-icon',
        'input-with-icon-left',
        'language-css',
        'language-html',
        'language-sh',
        'line',
        'list-unstyled',
        'list-group-item',
        'list-group',
        'm-0',
        'm-1',
        'm-2',
        'mb-1',
        'mb-2',
        'mb-3',
        'mb-4',
        'mb-5',
        'message',
        'message-primary',
        'ml-1',
        'ml-3',
        'ml-auto',
        'modus-icons',
        'moon',
        'mr-2',
        'mt-auto',
        'mt-0',
        'mt-2',
        'mt-3',
        'mt-4',
        'mt-5',
        'mt-md-5',
        'mt-sm-3',
        'mt-sm-4',
        'mt-sm-5',
        'mx-0',
        'mx-1',
        'mx-2',
        'mx-3',
        'mx-4',
        'mx-auto',
        'mx-xl-1',
        'mx-xl-2',
        'mx-xxl-2',
        'my-0',
        'na',
        'nav-icons',
        'nav-item',
        'nav-link',
        'navbar',
        'nt',
        'o',
        'opacity-50',
        'opacity-75',
        'open',
        'p-1',
        'p-2',
        'p-3',
        'p',
        'pl-0',
        'pl-1',
        'position-absolute',
        'position-fixed',
        'pr-0',
        'pre',
        'ps-4',
        'pt-1',
        'pt-2',
        'pt-3',
        'px-0',
        'px-1',
        'px-2',
        'px-3',
        'px-4',
        'py-0',
        'py-1',
        'py-2',
        'py-3',
        'py-4',
        'rounded',
        'rounded-3',
        'row-cols-xl-3',
        'row',
        's',
        'shadow-lg',
        'shadow-sm',
        'shadow',
        'show',
        'showBtn',
        'small',
        'sr-only',
        'stretched-link',
        'sun-and-moon',
        'sun-beams',
        'sun',
        'table',
        'table-bordered',
        'text-capitalize',
        'text-center',
        'text-danger',
        'text-decoration-none',
        'text-light',
        'text-md-left',
        'text-muted',
        'text-primary',
        'text-sm-right',
        'text-right',
        'text-trimble-blue-dark',
        'text-underline',
        'text-white',
        'theme-toggle',
        'tooltip',
        'tooltip-inner',
        'w-100',
        'w-50',
        'w-75',
      ],
    },
    autoprefixer: {},
  },
};
