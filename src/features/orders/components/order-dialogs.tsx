import { useCustomers } from "@/features/customers/hooks/use-customers";
import { useAllPublicationOptions } from "@/features/publications/hooks/use-publications";
import { getErrorMessage } from "@/lib/errors";
import {
  formatCollectionLabel,
  formatCurrency,
  formatDateTime,
  formatOrderStatus,
  getOrderStatusColor,
} from "@/lib/format";
import { orderValidation, type OrderForm } from "@/validations/order-validation";
import {
  Badge,
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  HStack,
  IconButton,
  Input,
  Portal,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import {
  useCreateOrderMutation,
  useUpdateOrderNotesMutation,
  useUpdateOrderStatusMutation,
} from "../hooks/use-orders";
import type { Order, OrderStatus } from "../types";

const emptyOrder: OrderForm = {
  customerId: "",
  customerName: "",
  notes: "",
  items: [
    {
      publicationId: "",
      publicationCollection: "books",
      publicationName: "",
      quantity: 1,
      unitPrice: 0,
    },
  ],
};

const selectStyle = {
  width: "100%",
  border: "1px solid rgba(15, 23, 42, 0.12)",
  borderRadius: "12px",
  padding: "12px",
  background: "white",
};

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOrderDialog({ open, onOpenChange }: CreateOrderDialogProps) {
  const { data: customers = [] } = useCustomers();
  const { data: publicationOptions = [] } = useAllPublicationOptions();
  const createMutation = useCreateOrderMutation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderValidation),
    defaultValues: emptyOrder,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (open) {
      reset(emptyOrder);
    }
  }, [open, reset]);

  const selectedItems = watch("items");
  const selectedCustomerId = watch("customerId");
  const activeCustomers = customers.filter((item) => item.active);
  const selectedCustomer = customers.find((item) => item.id === selectedCustomerId);
  const canCreateOrder = activeCustomers.length > 0 && publicationOptions.length > 0;
  const total = useMemo(
    () =>
      selectedItems.reduce(
        (acc, item) => acc + Number(item.quantity || 0) * Number(item.unitPrice || 0),
        0,
      ),
    [selectedItems],
  );

  async function onSubmit(values: OrderForm) {
    try {
      await createMutation.mutateAsync(values);
      onOpenChange(false);
      reset(emptyOrder);
    } catch (error) {
      toast.error(getErrorMessage(error, "Nao foi possivel criar o pedido."));
    }
  }

  return (
    <Dialog.Root size="cover" open={open} onOpenChange={(detail) => onOpenChange(detail.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Novo pedido</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pb="8" as="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={5}>
                <Field.Root invalid={!!errors.customerId}>
                  <Field.Label>Cliente</Field.Label>
                  <input type="hidden" {...register("customerId")} />
                  <input type="hidden" {...register("customerName")} />
                  <select
                    disabled={!activeCustomers.length}
                    value={selectedCustomerId}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                      const customer = customers.find((item) => item.id === event.target.value);
                      setValue("customerId", customer?.id ?? "", { shouldValidate: true });
                      setValue("customerName", customer?.name ?? "", { shouldValidate: true });
                    }}
                    style={selectStyle}
                  >
                    <option value="">Selecione um cliente</option>
                    {activeCustomers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                  <Field.ErrorText>{errors.customerId?.message}</Field.ErrorText>
                </Field.Root>

                {!activeCustomers.length ? (
                  <Box borderRadius="18px" bg="orange.50" p={4}>
                    <Text fontWeight="700" color="orange.900">
                      Nenhum cliente ativo disponivel
                    </Text>
                    <Text fontSize="sm" color="orange.800">
                      Cadastre ou reative um cliente antes de criar pedidos.
                    </Text>
                  </Box>
                ) : null}

                {!publicationOptions.length ? (
                  <Box borderRadius="18px" bg="orange.50" p={4}>
                    <Text fontWeight="700" color="orange.900">
                      Sem publicacoes disponiveis para venda
                    </Text>
                    <Text fontSize="sm" color="orange.800">
                      Apenas itens ativos com estoque maior que zero aparecem para selecao.
                    </Text>
                  </Box>
                ) : null}

                {selectedCustomer ? (
                  <Box borderRadius="18px" bg="teal.50" p={4}>
                    <Text fontWeight="700" color="teal.900">
                      Cliente selecionado
                    </Text>
                    <Text color="teal.800">{selectedCustomer.email || "Sem email cadastrado"}</Text>
                    <Text color="teal.800">{selectedCustomer.phone}</Text>
                  </Box>
                ) : null}

                <Stack gap={4}>
                  <HStack justify="space-between" align={{ base: "flex-start", md: "center" }}>
                    <Text fontWeight="800" color="gray.900">
                      Itens do pedido
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!publicationOptions.length}
                      onClick={() =>
                        append({
                          publicationId: "",
                          publicationCollection: "books",
                          publicationName: "",
                          quantity: 1,
                          unitPrice: 0,
                        })
                      }
                    >
                      <FiPlus />
                      Adicionar item
                    </Button>
                  </HStack>

                  {fields.map((field, index) => {
                    const currentItem = selectedItems[index];
                    const selectedOption = publicationOptions.find(
                      (item) =>
                        item.id === currentItem?.publicationId &&
                        item.collection === currentItem?.publicationCollection,
                    );

                    return (
                      <Box
                        key={field.id}
                        borderRadius="20px"
                        border="1px solid"
                        borderColor="blackAlpha.100"
                        bg="gray.50"
                        p={4}
                      >
                        <Stack gap={4}>
                          <Field.Root invalid={!!errors.items?.[index]?.publicationId}>
                            <Field.Label>Publicacao</Field.Label>
                            <input type="hidden" {...register(`items.${index}.publicationId`)} />
                            <input
                              type="hidden"
                              {...register(`items.${index}.publicationCollection`)}
                            />
                            <input type="hidden" {...register(`items.${index}.publicationName`)} />
                            <select
                              disabled={!publicationOptions.length}
                              value={
                                currentItem?.publicationId
                                  ? `${currentItem.publicationCollection}:${currentItem.publicationId}`
                                  : ""
                              }
                              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                                const selected = publicationOptions.find(
                                  (item) =>
                                    `${item.collection}:${item.id}` === event.target.value,
                                );
                                setValue(`items.${index}.publicationId`, selected?.id ?? "", {
                                  shouldValidate: true,
                                });
                                setValue(
                                  `items.${index}.publicationCollection`,
                                  selected?.collection ?? "books",
                                  { shouldValidate: true },
                                );
                                setValue(`items.${index}.publicationName`, selected?.name ?? "", {
                                  shouldValidate: true,
                                });
                              }}
                              style={selectStyle}
                            >
                              <option value="">Selecione uma publicacao</option>
                              {publicationOptions.map((option) => (
                                <option
                                  key={`${option.collection}:${option.id}`}
                                  value={`${option.collection}:${option.id}`}
                                >
                                  {option.name} | {formatCollectionLabel(option.collection)} |
                                  estoque {option.stock}
                                </option>
                              ))}
                            </select>
                            <Field.ErrorText>
                              {errors.items?.[index]?.publicationId?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          {selectedOption ? (
                            <Text fontSize="sm" color="gray.500">
                              Estoque disponivel: {selectedOption.stock}
                            </Text>
                          ) : null}

                          <HStack align="flex-start" gap={3} flexWrap="wrap">
                            <Field.Root
                              invalid={!!errors.items?.[index]?.quantity}
                              flex="1"
                              minW="140px"
                            >
                              <Field.Label>Quantidade</Field.Label>
                              <Input
                                type="number"
                                {...register(`items.${index}.quantity`, {
                                  valueAsNumber: true,
                                })}
                              />
                              <Field.ErrorText>
                                {errors.items?.[index]?.quantity?.message}
                              </Field.ErrorText>
                            </Field.Root>

                            <Field.Root
                              invalid={!!errors.items?.[index]?.unitPrice}
                              flex="1"
                              minW="160px"
                            >
                              <Field.Label>Valor unitario</Field.Label>
                              <Input
                                type="number"
                                step="0.01"
                                {...register(`items.${index}.unitPrice`, {
                                  valueAsNumber: true,
                                })}
                              />
                              <Field.ErrorText>
                                {errors.items?.[index]?.unitPrice?.message}
                              </Field.ErrorText>
                            </Field.Root>

                            <IconButton
                              aria-label="Remover item"
                              variant="outline"
                              mt={8}
                              disabled={fields.length === 1}
                              onClick={() => remove(index)}
                            >
                              <FiTrash2 />
                            </IconButton>
                          </HStack>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>

                <Field.Root invalid={!!errors.notes}>
                  <Field.Label>Observacoes</Field.Label>
                  <Textarea minH="110px" {...register("notes")} />
                  <Field.ErrorText>{errors.notes?.message}</Field.ErrorText>
                </Field.Root>

                <Box
                  borderRadius="20px"
                  bg="gray.900"
                  color="white"
                  p={5}
                  display="flex"
                  justifyContent="space-between"
                  alignItems={{ base: "flex-start", md: "center" }}
                  flexDirection={{ base: "column", md: "row" }}
                  gap={3}
                >
                  <Box>
                    <Text fontSize="sm" color="gray.300">
                      Total previsto
                    </Text>
                    <Text fontSize="2xl" fontWeight="800">
                      {formatCurrency(total)}
                    </Text>
                  </Box>

                  <Button
                    type="submit"
                    bg="teal.400"
                    color="gray.900"
                    loading={isSubmitting}
                    disabled={!canCreateOrder}
                  >
                    {canCreateOrder ? "Criar pedido" : "Pedido indisponivel"}
                  </Button>
                </Box>
              </Stack>
            </Dialog.Body>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  const [notes, setNotes] = useState("");
  const updateNotesMutation = useUpdateOrderNotesMutation();

  useEffect(() => {
    setNotes(order?.notes ?? "");
  }, [order]);

  if (!order) {
    return null;
  }

  const currentOrder = order;

  async function handleSaveNotes() {
    try {
      const orderId = currentOrder.id;
      await updateNotesMutation.mutateAsync({ id: orderId, notes });
      toast.success("Observacoes atualizadas.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Nao foi possivel atualizar as observacoes."));
    }
  }

  return (
    <Dialog.Root size="lg" open={open} onOpenChange={(detail) => onOpenChange(detail.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{currentOrder.code}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pb="8">
              <Stack gap={5}>
                <Box
                  borderRadius="20px"
                  border="1px solid"
                  borderColor="blackAlpha.100"
                  bg="gray.50"
                  p={4}
                >
                  <HStack justify="space-between" align="flex-start" mb={3}>
                    <Box>
                      <Text fontWeight="800" color="gray.900">
                        {currentOrder.customerName}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Criado em {formatDateTime(currentOrder.createdAt as Date | null)}
                      </Text>
                    </Box>
                    <Badge colorPalette={getOrderStatusColor(currentOrder.status)}>
                      {formatOrderStatus(currentOrder.status)}
                    </Badge>
                  </HStack>

                  <Text fontWeight="700" color="gray.900" mb={3}>
                    Itens
                  </Text>
                  <Stack gap={3}>
                    {currentOrder.items.map((item) => (
                      <Box
                        key={`${item.publicationCollection}:${item.publicationId}`}
                        borderRadius="16px"
                        bg="white"
                        border="1px solid"
                        borderColor="blackAlpha.100"
                        p={3}
                      >
                        <HStack justify="space-between" align="flex-start">
                          <Box>
                            <Text fontWeight="700" color="gray.900">
                              {item.publicationName}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {formatCollectionLabel(item.publicationCollection)}
                            </Text>
                          </Box>
                          <Text fontWeight="700" color="gray.900">
                            {formatCurrency(item.total)}
                          </Text>
                        </HStack>
                        <Text mt={2} fontSize="sm" color="gray.600">
                          {item.quantity} x {formatCurrency(item.unitPrice)}
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Field.Root>
                  <Field.Label>Observacoes</Field.Label>
                  <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
                </Field.Root>

                <Button
                  alignSelf="flex-end"
                  bg="teal.600"
                  color="white"
                  onClick={handleSaveNotes}
                  loading={updateNotesMutation.isPending}
                >
                  Salvar observacoes
                </Button>
              </Stack>
            </Dialog.Body>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

interface OrderStatusDialogProps {
  order: Order | null;
  nextStatus: OrderStatus | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderStatusDialog({
  order,
  nextStatus,
  open,
  onOpenChange,
}: OrderStatusDialogProps) {
  const statusMutation = useUpdateOrderStatusMutation();

  if (!order || !nextStatus) {
    return null;
  }

  const currentOrder = order;
  const targetStatus = nextStatus;

  async function handleConfirm() {
    try {
      await statusMutation.mutateAsync({ id: currentOrder.id, status: targetStatus });
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Nao foi possivel atualizar o status do pedido."));
    }
  }

  return (
    <Dialog.Root size="sm" open={open} onOpenChange={(detail) => onOpenChange(detail.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Atualizar status</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="8">
              <Text color="gray.600">
                Pedido {currentOrder.code} sera movido para{" "}
                <Text as="span" fontWeight="700" color="gray.900">
                  {formatOrderStatus(targetStatus)}
                </Text>
                .
              </Text>

              {targetStatus === "cancelado" ? (
                <Text mt={3} fontSize="sm" color="red.600">
                  O cancelamento devolve os itens ao estoque automaticamente.
                </Text>
              ) : null}

              <HStack justify="flex-end" mt={6}>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Voltar
                </Button>
                <Button
                  colorPalette={targetStatus === "cancelado" ? "red" : "teal"}
                  onClick={handleConfirm}
                  loading={statusMutation.isPending}
                >
                  Confirmar
                </Button>
              </HStack>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
