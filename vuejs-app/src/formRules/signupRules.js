export default {
  email: [
    {
      required: true,
      message: 'Please fill out this field.',
      trigger: 'change',
    },
    {
      min: 5,
      message: `Please input a minimun of 5 characters.`,
      trigger: 'change',
    },
    {
      max: 50,
      message: `Maximum of 50 characters reached.`,
      trigger: 'change',
    },
    {
      pattern: new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),
      message: 'Invalid Email format',
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      message: 'Please fill out this field.',
      trigger: 'change',
    },
    {
      min: 6,
      message: `Please input a minimun of 6 characters.`,
      trigger: 'change',
    },
    {
      max: 20,
      message: `Maximum of 20 characters reached.`,
      trigger: 'change',
    },
    {
      pattern: new RegExp(/^(?=.*[a-z])(?=.*\d)(?=.*[-+_!@#$%^&*.,?]).+$/),
      message: `Must have letters, numbers, and common symbols.`,
      trigger: 'change',
    },
  ],
};
