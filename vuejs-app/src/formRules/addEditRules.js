export default {
  name: [
    {
      required: true,
      message: 'Please fill out this field.',
      trigger: 'change',
    },
    {
      max: 20,
      message: `Maximum of 20 characters reached.`,
      trigger: 'change',
    },
    {
      pattern: new RegExp(/^[ぁ-ゔァ-ヴー]+$/u),
      message: 'Invalid japanese characters.',
      trigger: 'change',
    },
  ],
  occupation: [
    {
      required: true,
      message: 'Please fill out this field.',
      trigger: 'change',
    },
    {
      max: 40,
      message: `Maximum of 40 characters reached.`,
      trigger: 'change',
    },
  ],
  phone: [
    {
      required: true,
      message: 'Please fill out this field.',
      trigger: 'change',
    },
    {
      min: 9,
      message: `Minimum of 9 numbers required.`,
      trigger: 'change',
    },
    {
      max: 12,
      message: `Maximum of 12 numbers reached.`,
      trigger: 'change',
    },
    {
      pattern: new RegExp(/^[0-9]*$/),
      message: 'Invalid phone number.',
      trigger: 'change',
    },
  ],
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
      min: 5,
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
  interest: [
    {
      required: true,
      message: 'Please fill out this field.',
      trigger: 'change',
    },
    {
      max: 20,
      message: `Maximum of 20 characters reached.`,
      trigger: 'change',
    },
  ],
  birthday: [
    {
      required: true,
      message: 'Please fill out this field.',
      trigger: 'blur',
    },
    {
      type: 'date',
      asyncValidator: (rule, value) => {
        const inputDate = new Date(value);

        return new Promise((resolve, reject) => {
          if (isNaN(inputDate.getTime())) {
            reject('Invalid date');
          } else if (inputDate > new Date()) {
            reject('Future date is invalid.');
          } else {
            resolve();
          }
        });
      },
      trigger: 'change',
    },
  ],
  title: [
    {
      required: true,
      message: 'Please fill out this field.',
      trigger: 'change',
    },
    {
      max: 50,
      message: `Maximum of 50 characters reached.`,
      trigger: 'change',
    },
  ],
  content: [
    {
      required: true,
      message: 'Please fill out this field.',
      trigger: 'change',
    },
    {
      max: 4000,
      message: `Maximum of 4000 characters reached.`,
      trigger: 'change',
    },
  ],
};
