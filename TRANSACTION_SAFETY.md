# 🔒 Seguridad de Transacciones con Pessimistic Locking

## Descripción

Este sistema implementa **transacciones atómicas** con **pessimistic locking** para garantizar la integridad de las transferencias de dinero.

## 🔐 Características de Seguridad

### **1. Pessimistic Locking**
```typescript
// Bloquea las filas durante la transacción
const originUser = await queryRunner.manager
  .createQueryBuilder(Account, 'account')
  .setLock('pessimistic_write')  // FOR UPDATE
  .where('account.id = :id', { id: originUserId })
  .getOne();
```

### **2. Transacciones Atómicas**
```typescript
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
  // Todas las operaciones aquí son atómicas
  await queryRunner.commitTransaction();
} catch (error) {
  await queryRunner.rollbackTransaction();
  // Rollback automático si algo falla
}
```

### **3. Flujo de Transferencia Segura**

#### **Paso 1: Crear Transacción**
```typescript
const transaction = await createTransaction({
  originUserId: "user-1-uuid",
  destinyUserId: "user-2-uuid", 
  amount: 100.50
});
// Status: PENDING
```

#### **Paso 2: Ejecutar Transferencia**
```sql
BEGIN TRANSACTION;

-- Bloquear cuenta origen (FOR UPDATE)
SELECT * FROM accounts WHERE id = 'user-1-uuid' FOR UPDATE;

-- Bloquear cuenta destino (FOR UPDATE)  
SELECT * FROM accounts WHERE id = 'user-2-uuid' FOR UPDATE;

-- Verificar saldo
IF origin_balance < 100.50 THEN
  ROLLBACK;
  RAISE EXCEPTION 'Insufficient funds';
END IF;

-- Actualizar balances
UPDATE accounts SET balance = balance - 100.50 WHERE id = 'user-1-uuid';
UPDATE accounts SET balance = balance + 100.50 WHERE id = 'user-2-uuid';

-- Marcar transacción como completada
UPDATE transactions SET status = 'COMPLETED' WHERE id = 'transaction-uuid';

COMMIT;
```

## 🛡️ Protecciones Implementadas

### **1. Condiciones de Carrera**
- ✅ **Pessimistic Locking** previene lecturas simultáneas
- ✅ **FOR UPDATE** bloquea filas hasta el commit
- ✅ **Transacciones atómicas** garantizan consistencia

### **2. Rollback Automático**
- ✅ **Error en validación** → Rollback completo
- ✅ **Error en actualización** → Rollback completo  
- ✅ **Error en commit** → Rollback completo
- ✅ **Transacción marcada como FAILED**

### **3. Validaciones**
- ✅ **Saldo suficiente** antes de transferir
- ✅ **Usuarios existen** antes de operar
- ✅ **Transacción existe** antes de actualizar

## 📊 Estados de Transacción

| Estado | Descripción |
|--------|-------------|
| `PENDING` | Transacción creada, esperando procesamiento |
| `COMPLETED` | Transferencia exitosa, balances actualizados |
| `FAILED` | Error durante la transferencia, rollback ejecutado |
| `REJECTED` | Transacción rechazada manualmente |

## 🔍 Ejemplo de Uso

```typescript
// 1. Crear transacción
const transaction = await transactionRepository.createTransaction({
  originUserId: "user-1-uuid",
  destinyUserId: "user-2-uuid",
  amount: 100.50
});

// 2. Ejecutar transferencia (automáticamente con locking)
await transactionRepository.transferMoney(
  "user-1-uuid",
  "user-2-uuid", 
  100.50,
  transaction.id
);

// 3. Verificar resultado
const updatedTransaction = await transactionRepository.getTransactionById(transaction.id);
console.log(updatedTransaction.status); // "COMPLETED" o "FAILED"
```

## ⚡ Ventajas de esta Implementación

1. **Atomicidad**: O se ejecuta todo o nada
2. **Consistencia**: Los balances siempre suman correctamente
3. **Aislamiento**: Transacciones simultáneas no interfieren
4. **Durabilidad**: Los cambios se persisten correctamente
5. **Seguridad**: Previene condiciones de carrera
6. **Trazabilidad**: Estado claro de cada transacción

## 🚨 Casos de Error

### **Saldo Insuficiente**
```typescript
// Rollback automático, transacción marcada como FAILED
throw new Error('Insufficient funds in origin account');
```

### **Usuario No Encontrado**
```typescript
// Rollback automático, transacción marcada como FAILED  
throw new Error('Origin user not found');
```

### **Error de Base de Datos**
```typescript
// Rollback automático, transacción marcada como FAILED
catch (error) {
  await queryRunner.rollbackTransaction();
  // Marcar como FAILED
}
``` 