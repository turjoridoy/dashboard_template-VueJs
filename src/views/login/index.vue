<template>
  <section class="login">
    <div class="container mx-auto">
      <div class="max-w-[320px] mx-auto pt-[100px]">
        <img
          src="@/assets/images/login.png"
          class="max-w-full block mx-auto mb-10"
          alt=""
        />
        <a-form
          :model="form"
          @finish="
            async () => {
              isLoading = true;
              let res = await login(form, $router);
              res && (isLoading = false);
            }
          "
        >
          <a-form-item
            name="email"
            :rules="[{ required: true, message: 'Please input your email!' }]"
          >
            <a-input
              placeholder="email*"
              class="bg-transparent border-white text-white uppercase py-4 px-3"
              v-model:value="form.email"
            >
              <template #prefix>
                <img
                  src="@/assets/images/user.png"
                  alt=""
                  class="pr-2 max-w-full"
                />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            name="password"
            :rules="[
              { required: true, message: 'Please input your password!' },
            ]"
          >
            <a-input-password
              placeholder="Password*"
              class="bg-transparent border-white text-white uppercase py-4 px-3"
              v-model:value="form.password"
            >
              <template #prefix>
                <img
                  src="@/assets/images/lock.png"
                  alt=""
                  class="pr-2 max-w-full"
                />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button
              html-type="submit"
              class="font-semibold tracking-wider text-lg text-primary bg-white border-white uppercase h-12 w-full"
            >
              <span v-if="!isLoading">Login</span>
              <a-spin v-else />
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { login } from "@/stores/login.js";

const form = ref({
  email: "",
  password: "",
});
const isLoading = ref(false);
</script>

<style lang="scss">
.login {
  background: url(@/assets/images/bg.jpg) no-repeat center;
  background-size: cover;
  min-height: 100vh;
}
.ant-input {
  background: transparent;
  color: #fff;
}
.ant-input::placeholder {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #fff;
  opacity: 0.5;
}
.anticon {
  svg {
    fill: #fff !important;
    opacity: 0.5;
  }
}
</style>
