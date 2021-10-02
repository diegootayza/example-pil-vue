<template>
    <v-main>
        <v-container>
            <v-card outlined>
                <v-card-title>
                    <v-text-field v-model="search" dense hide-details label="Buscar..." outlined />
                </v-card-title>
                <v-divider />
                <v-card-text>
                    <v-row>
                        <v-col v-for="(item, index) in items" :key="index" cols="3">
                            <v-card outlined>
                                <v-img
                                    class="white--text align-end"
                                    gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
                                    height="140px"
                                    :src="item.image"
                                >
                                    <v-card-title class="text-caption">{{ item.name }}</v-card-title>
                                </v-img>
                                <v-card-subtitle class="pb-0"
                                    >Stock <b>{{ item.stock }}</b></v-card-subtitle
                                >
                                <v-card-actions>
                                    <v-btn color="success" text>Comprar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <v-spacer />
                    <v-pagination :length="totalPages" :total-visible="10" :value="page" @input="controllerPaginate($event)" />
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-container>

        <v-dialog persistent :value="dialogCreate">
            <v-card>
                <v-card-title>
                    <span>Crear producto</span>
                    <v-spacer />
                    <v-btn color="success">Crear producto</v-btn>
                </v-card-title>
            </v-card>
        </v-dialog>
    </v-main>
</template>

<script lang="ts">
    import Vue from 'vue'

    import socket from '@/services/socket'

    export default Vue.extend({
        data() {
            return {
                dialogCreate: false,
                items: [] as any[],
                search: '',
                page: 1,
                totalPages: 0,
            }
        },
        watch: {
            search: {
                immediate: false,
                handler() {
                    this.page = 1
                    this.readDocs()
                },
            },
        },
        methods: {
            readDocs() {
                socket.emit('read:products', {
                    filter: {
                        search: this.search.length > 0 ? this.search : undefined,
                    },
                    options: {
                        page: this.page,
                        limit: 12,
                    },
                })
            },
            controllerPaginate(item: number) {
                this.page = item
                this.readDocs()
            },
        },
        created() {
            this.readDocs()

            socket.on('products', (response) => {
                this.items = response.docs
                this.page = response.page
                this.totalPages = response.totalPages
            })
        },
    })
</script>
