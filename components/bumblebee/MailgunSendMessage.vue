<template>
<div class="MailgunSendMessage">
  <div class="field is-horizontal">
    <div class="field-label is-normal"><label class="label">App</label></div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              <button class="button">
                <span>App</span>
                <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
              </button>
            </div>
            <div class="dropdown-menu">
              <div class="dropdown-content">
                <a href="#" class="dropdown-item">App 1</a>
                <a href="#" class="dropdown-item">App 2</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="field is-horizontal">
    <div class="field-label is-normal"><label class="label">Sender</label></div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <input class="input" type="text" placeholder="e.g. John Doe">
        </div>
      </div>
    </div>
  </div>
  <div class="field is-horizontal">
    <div class="field-label is-normal"><label class="label">Sender Email</label></div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <input class="input" type="text" placeholder="e.g. john@company.com">
        </div>
      </div>
    </div>
  </div>
  <div class="field is-horizontal">
    <div class="field-label is-normal"><label class="label">To</label></div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <input class="input" type="text" placeholder="e.g. Jenny">
        </div>
      </div>
    </div>
  </div>
  <div class="field is-horizontal">
    <div class="field-label is-normal"><label class="label">To email</label></div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <input class="input" type="text" placeholder="e.g. jenny@email.com">
        </div>
      </div>
    </div>
  </div>
  <div class="field is-horizontal">
    <div class="field-label is-normal"><label class="label">Subject</label></div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <input class="input" type="text" placeholder="e.g. Partnership opportunity">
        </div>
      </div>
    </div>
  </div>
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label">Message</label>
    </div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <textarea class="textarea" placeholder="Explain how we can help you"></textarea>
        </div>
      </div>
    </div>
  </div>
  <div class="buttons is-right">
    <a class="button is-primary is-rounded">Send</a>
  </div>
</div>
</template>


<script>
export default {
  data() {
    return {}
  },
  methods: {},
}
</script>
