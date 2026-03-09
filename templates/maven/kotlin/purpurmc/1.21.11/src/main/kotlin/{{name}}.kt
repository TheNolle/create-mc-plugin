package {{groupId}}

import org.bukkit.plugin.java.JavaPlugin

@Suppress("unused")
class {{NAME}} : JavaPlugin() {
    override fun onEnable() {
        logger.info("Enabled {{NAME}}...")
    }
}
